import * as path from 'node:path';
import * as url from "node:url";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { meRouter,ipRouter,metricsRouter } from "./routeHandler/routeHandlerExport.js";
import { monitoringService } from './services/servicesExport.js'
dotenv.config();

export const app = express()
const PORT = Number(process.env.PORT) || 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, '../frontendBuild');

app.set('trust proxy', true);
app.use(cors())

app.use((req,res,next) => {
    const IGNORED_PATHS = [
        '/favicon.ico',
        '/favicon.svg',
    ];
    const IGNORED_PREFIXES = [
        '/_astro',
        '/static',
        '/public',
        '/assets',
        '/up-time',
    ];

    const method = req.method;
    const [pathOnly, queryString] = req.originalUrl.split('?');
    const segments = pathOnly.split('/').filter(Boolean);
    const query = queryString ? `?${queryString}` : '';
    const route = segments.length > 0 ? `/${segments[0]}${query}` : `/${query}`;

    const shouldIgnore =
        IGNORED_PATHS.includes(pathOnly) ||
        IGNORED_PREFIXES.some(prefix => pathOnly.startsWith(prefix));

    if (shouldIgnore) return next();
    const endHttpTimer = monitoringService.getHistogram("httpDuration[MRS]")?.startTimer({method,route})
    monitoringService.getGauge("httpActiveReqGauge[R]")?.inc({route})

    res.on('finish',async ()=>{
        const status = res.statusCode?.toString()
        monitoringService.getCounter("httpTotalCounter")?.inc()
        monitoringService.getCounter("httpReqCounter[MRS]")?.inc({method,route,status})
        monitoringService.getGauge("httpActiveReqGauge[R]")?.dec({route})
        if(endHttpTimer) endHttpTimer({status})
    })

    next();
})

app.use(express.static(frontendBuildPath));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..','frontendBuild','index.html'));
})

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname,'..','html', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname,'..','html', 'sitemap.xml'));
});

app.use('/ip', ipRouter);
app.use('/me', meRouter);

app.get('/bulk/:bulkIP',(req,res)=>{
    const bulkIP = req.params.bulkIP;
    console.log(bulkIP.split(","))
    res.json({success:false,message:"Failed"})
})

app.use('/metrics', metricsRouter)

app.get('/health', (req, res) => {
    res.status(200).send('Working')
})

app.get('/up-time',(req,res)=>{
    res.status(200).json({success:true})
})

app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);  
})
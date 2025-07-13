import * as path from 'node:path';
import * as url from "node:url";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {meRouter,ipRouter} from "./routeHandler/routeHandlerExport.js";
dotenv.config();

const app = express()
const PORT = Number(process.env.PORT) || 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.resolve(__dirname, '../frontendBuild');

app.set('trust proxy', true);
app.use(cors())
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
app.use('/me',meRouter);

app.get('/bulk/:bulkIP',(req,res)=>{
    const bulkIP = req.params.bulkIP;
    console.log(bulkIP.split(","))
    res.json({success:false,message:"Failed"})
})

app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);  
})
import * as path from 'node:path';
import * as url from "node:url";
import express from 'express';
import cors from 'cors';
import { ipDataService } from './ipData.js';
import dotenv from 'dotenv';
import {cacheGetter, cacheSetter} from "./services/servicesExport.js";
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reactStaticPath = path.resolve(__dirname, '..', '..', '..', 'html', 'ipwho.org');
console.log(path.resolve(__dirname,'..','..','..','html','ipwho.org'))

app.set('trust proxy', true);
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..','html','index.html'));
})

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname,'..','html', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname,'..','html', 'sitemap.xml'));
});

app.use('/', express.static(reactStaticPath));

app.get('/home', (req, res) => {
    res.sendFile(path.join(reactStaticPath, 'index.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(reactStaticPath, 'index.html'));
});


app.get('/ip/:ip', async (req, res) => {
    const ip = req.params.ip
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    if(cachedData){
        res.json({ success: true, data:JSON.parse(cachedData) })
        return
    }

    const getQuery = req.query.get
    const data = ipDataService.getData(ip)
    if(getQuery){

    const dataToReturn = getQuery?.split(",")
    const newData = {}
    for (const item of dataToReturn) {
        // @ts-ignore
        newData[item] = null;
    }

    if (!data) {
        res.json({success:false,message:"Failed"})
        return
    }

    if(dataToReturn.length > 0){
        for (const item of dataToReturn) {
            // @ts-ignore
            if(data[item]){
                // @ts-ignore
                newData[item] = data[item];
            }
        }
        await cacheSetter.query({type:'incr',key:`${ip}RM`})
        await cacheSetter.query({type:'set',key:`${ip}D`,value:JSON.stringify(data),expiry: 1800})
        res.json({ success: true, data:newData })
        return;
    }
    }

    await cacheSetter.query({type:'incr',key:`${ip}RM`})
    await cacheSetter.query({type:'set',key:`${ip}D`,value:JSON.stringify(data),expiry: 1800})
    res.json({ success: true, data })
})

app.get('/me', async (req, res) => {
    const ip = req.ip;
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    if(cachedData){
        res.json({ success: true, data:JSON.parse(cachedData) })
        return
    }
    const data = ipDataService.getData(ip!)
    if (!data) {
        res.json({success:false,message:"Failed"})
        return
    }
    await cacheSetter.query({type:'incr',key:`${ip}RM`})
    await cacheSetter.query({type:'set',key:`${ip}D`,value:JSON.stringify(data),expiry: 1800})
    res.json({ success: true, data })
})

app.get('/bulk/:bulkIP',(req,res)=>{
    const bulkIP = req.params.bulkIP;
    console.log(bulkIP.split(","))
    res.json({success:false,message:"Failed"})
})


app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);  
})
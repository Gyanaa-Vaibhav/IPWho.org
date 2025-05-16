import maxmind,{CityResponse} from 'maxmind';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from "node:url";
import { IP2Proxy } from 'ip2proxy-nodejs';
import express from 'express';
import cors from 'cors';
import { Reader } from '@maxmind/geoip2-node';
import { ipDataService } from './ipData.js';

const app = express()
const PORT = 5172;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())

app.get('/', (req, res) => {
    res.json({success:true,message:"Hello"})
})

app.get('/ip/:ip', (req, res) => {
    const ip = req.params.ip
    const data = ipDataService.getData(ip)
    if (!data) {
        res.json({success:false,message:"Failed"})
        return
    }
    res.json({ success: true, data })
})

app.get('/me', (req, res) => {
    const ip = req.ip;    
    const data = ipDataService.getData(ip)
    if (!data) {
        res.json({success:false,message:"Failed"})
        return
    }
    res.json({ success: true, data })
})


app.listen(PORT,() => {
    console.log(`Listening on Port ${PORT}`);  
})
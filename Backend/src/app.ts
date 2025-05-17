import * as path from 'node:path';
import * as url from "node:url";
import express from 'express';
import cors from 'cors';
import { ipDataService } from './ipData.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reactStaticPath = path.resolve(__dirname, '..', '..', '..', 'html', 'ipwho.org');
console.log(path.resolve(__dirname,'..','..','..','html','ipwho.org'))

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


app.get('/ip/:ip', (req, res) => {
    const ip = req.params.ip
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
        res.json({ success: true, data:newData })
        return;
    }
    }

    res.json({ success: true, data })
})

app.get('/me', (req, res) => {
    const ip = req.ip;
    const data = ipDataService.getData(ip!)
    if (!data) {
        res.json({success:false,message:"Failed"})
        return
    }
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
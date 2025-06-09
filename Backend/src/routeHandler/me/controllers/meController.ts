// Controller for me
import { Request, Response } from 'express';
import {cacheGetter,cacheSetter,ipDataService} from '../../../services/servicesExport.js'

export async function renderMe (req:Request, res:Response)  {
    const ip = req.ip;
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    const rateLimit = await cacheGetter.query({type:"get",key:`${ip}RL`})
    if(rateLimit && rateLimit > 100_000) {
        res.json({ success: false, message:"Monthly Limit Exceed"});
        return;
    }else if(!rateLimit){
        await cacheSetter.query({type:"set",key:`${ip}RL`,expiry: 25_92_000, value:'1'})
    }
    if(cachedData){
        await cacheSetter.query({type:'incr',key:`${ip}RL`})
        res.json({ success: true, data:JSON.parse(cachedData) })
        return
    }
    const data = ipDataService.getData(ip!)
    if (!data) {
        res.json({success:false,message:"Invalid/Reserved IP"})
        return
    }
    await cacheSetter.query({type:"set",key:`${ip}RL`,expiry: 25_92_000, value:"1"})
    await cacheSetter.query({type:'set',key:`${ip}D`,value:JSON.stringify(data),expiry: 1800})
    res.json({ success: true, data })
}

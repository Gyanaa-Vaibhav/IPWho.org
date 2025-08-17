// Controller for me
import { Request, Response } from 'express';
import {cacheGetter, cacheSetter, ipDataService, monitoringService} from '../../../services/servicesExport.js'
import { monthlyRateLimit } from '../../helperFunctions/helperExport.js'

function getCleanIp(req:Request) {
    if(!req.ip) {
        throw new Error('Missing ip');
    }
    return req.ip.replace(/^::ffff:/, '');
}

export async function renderMe (req:Request, res:Response)  {
    const ip = getCleanIp(req);
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    const rateLimit = await cacheGetter.query({type:"get",key:`${ip}RL`})

    if(!rateLimit) {
        monitoringService.getCounter("uniqueVisitorsCounter[ip?]")?.inc()
        await cacheSetter.query({type: "incr", key: `meRouteUser`})
    }

    // Monthly Rate Limit check
    await monthlyRateLimit(res,rateLimit,ip!)
    if (res.headersSent) return;

    await cacheSetter.query({type:'incr',key:`${ip}RL`})
    if(cachedData){
        res.json({ success: true, data:JSON.parse(cachedData) })
        return
    }
    const data = ipDataService.getData(ip!, req)

    if (!data) {
        res.json({success:false,message:"Invalid/Reserved IP"})
        return
    }

    await cacheSetter.query({type:'set',key:`${ip}D`,value:JSON.stringify(data),expiry: 1800})
    res.json({ success: true, data })
}


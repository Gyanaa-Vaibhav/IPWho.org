// Controller for ip
import { Request, Response } from 'express';
import {cacheGetter,cacheSetter,ipDataService} from '../../../services/servicesExport.js'
import {getQueryHelper} from "./getQueryHelper.js";
import {monthlyRateLimit} from '../../helperFunctions/helperExport.js'

export async function renderIp (req:Request, res:Response) {
    const ip: string = req.params.ip
    const lookUpIP: string | undefined = req.ip;
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    const rateLimit = await cacheGetter.query({type:"get",key:`${lookUpIP}RL`})
    const getQuery = req.query.get as string;

    // Monthly Rate Limit check
    await monthlyRateLimit(res,rateLimit,ip!)

    if (cachedData) {
        const data = JSON.parse(cachedData)

        if(getQuery){
            await getQueryHelper({getQuery,ip,lookUpIP,res,data})
            return
        }

        if(data.invalid) {
            await cacheSetter.query({type:'incr',key:`${lookUpIP}RL`})
            res.statusCode = 404;
            const {invalid, ...data2} = data
            res.json({...data2});
            return
        }

        await cacheSetter.query({type:'incr',key:`${lookUpIP}RL`})
        res.json({ success: true, data });
        return;
    }

    const data = ipDataService.getData(ip)

    if(getQuery){
        await getQueryHelper({getQuery,ip,lookUpIP,res,data})
        return
    }

    await cacheSetter.query({type:'incr',key:`${lookUpIP}RL`})
    await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(data || {success:false,message:"Reserved range/Invalid IP address",invalid:true}), expiry: 1800 });
    res.json({ success: true, data })
}

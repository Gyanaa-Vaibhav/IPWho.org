// Controller for ip
import { Request, Response } from 'express';
import {cacheGetter, cacheSetter, ipDataService, monitoringService} from '../../../services/servicesExport.js'
import {getQueryHelper} from "./getQueryHelper.js";
import {monthlyRateLimit} from '../../helperFunctions/helperExport.js'
import formatConverter from "./formatConverter.js";
import {IpGeoResponse} from "../../../services/ip/ipData.js";

function getCleanIp(req:Request) {
    if(!req.ip) {
        throw new Error('Missing ip');
    }
    return req.ip.replace(/^::ffff:/, '');
}

export async function renderIp (req:Request, res:Response) {
    const ip: string = req.params.ip;
    const format = req.query.format as string || 'json';
    const lookUpIP: string = getCleanIp(req);
    const cacheDataTimer = monitoringService.getHistogram("cacheDuration[KH]")?.startTimer({key:"ipData"})
    const cacheUserRetrievalTimer = monitoringService.getHistogram("cacheDuration[KH]")?.startTimer({key:"userRL"})
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    const rateLimit = await cacheGetter.query({type:"get",key:`${lookUpIP}RL`})
    const getQuery = req.query.get as string;
    monitoringService.getCounter("ipServiceCounter[ip?]")?.inc({ip:lookUpIP})

    await cacheSetter.query({type:"incr",key:"totalIPRequests"})
    await cacheSetter.query({type:'incr',key:`${lookUpIP}RL`})

    if(!rateLimit) {
        if(cacheUserRetrievalTimer) cacheUserRetrievalTimer({hit:"false"})
        await cacheSetter.query({type: "incr", key: "uniqueUserIP"})
    }

    // Monthly Rate Limit check
    await monthlyRateLimit(res,rateLimit,ip!)

    if (cachedData) {
        monitoringService.getCounter("cacheHitsCounter[K]")?.inc({key: 'ipData'})
        if(cacheDataTimer) cacheDataTimer({hit:"true"})
        return await formatAndReturn({res, data: JSON.parse(cachedData), getQuery, format})
    }
    // console.log("Cache Missing first Count")

    if(cacheDataTimer) cacheDataTimer({hit:"false"})
    if(cacheUserRetrievalTimer) cacheUserRetrievalTimer({hit:"true"})
    const data = ipDataService.getData(ip) || {success:false,message:"Reserved range/Invalid IP address"}
    await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(data), expiry: 1800 });
    monitoringService.getCounter("cacheMissCounter[K]")?.inc({key: 'ipData'})
    await formatAndReturn({res, data, getQuery, format})
}


async function formatAndReturn({res, data, getQuery, format}:{res:Response,data:any,getQuery:string,format:string}) {
    if(!data || data?.success === false){
        res.statusCode = 404;
        res.send(formatConverter({format,data,res}));
        return
    }

    let formattedData:string | IpGeoResponse = data
    if(getQuery){
        formattedData = await getQueryHelper({getQuery,data}) as IpGeoResponse
    }

    if(format){
        res.send(formatConverter({format,data: {success:true,data:formattedData},res}));
        return
    }

    res.json({ success: true, data:{success:true,data:formattedData} })
}
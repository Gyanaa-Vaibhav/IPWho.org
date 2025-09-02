import { Request, Response } from 'express';
import {
    logError,
    ipDataService,
    cacheSetter,
    cacheGetter,
    monitoringService
} from "../../../services/servicesExport.js";
export default async function handleBulk (req:Request, res:Response) {
    try{
        const bulk = req.params.bulkIP.split(",");
        const responseArray = []
        for (const ip of bulk) {
            const cacheDataTimer = monitoringService.getHistogram("cacheDuration[KH]")?.startTimer({key:"ipData"})
            const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
            const cacheUserRetrievalTimer = monitoringService.getHistogram("cacheDuration[KH]")?.startTimer({key:"userRL"})

            if(cachedData){
                monitoringService.getCounter("cacheHitsCounter[K]")?.inc({key: 'ipData'})
                if(cacheDataTimer) cacheDataTimer({hit:"true"})
                responseArray.push(JSON.parse(cachedData))
                continue
            }
            const ipData = ipDataService.getData(ip,req) || {success:false,message:"Reserved range/Invalid IP address"}


            if(cacheDataTimer) cacheDataTimer({hit:"false"})
            if(cacheUserRetrievalTimer) cacheUserRetrievalTimer({hit:"true"})
            await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(ipData), expiry: 1800 });

            if (!(ipData as { success: boolean }).success) {
                responseArray.push({ ip, ...ipData });
            } else {
                responseArray.push({success: true, ...ipData});
            }
        }
        res.status(200).json({ success:true, data: {responseArray} });

    }catch (e:unknown){
        logError(e);
        res.status(500).json({success:false,message:"Something went wrong"});
    }
}

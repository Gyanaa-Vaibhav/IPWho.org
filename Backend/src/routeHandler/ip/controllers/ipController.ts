// Controller for ip
import { Request, Response } from 'express';
import {cacheGetter,cacheSetter,ipDataService} from '../../../services/servicesExport.js'
export async function renderIp (req:Request, res:Response) {
    const ip = req.params.ip
    const requestIp = req.ip;
    const cachedData = await cacheGetter.query({type:"get",key:`${ip}D`})
    const rateLimit = await cacheGetter.query({type:"get",key:`${requestIp}RL`})

    if(rateLimit && rateLimit > 100_000) {
        res.json({ success: false, message:"Monthly Limit Exceed"});
        return;
    }else if(!rateLimit){
        await cacheSetter.query({type:"set",value:"1",key:`${requestIp}RL`,expiry: 25_92_000})
    }

    if (cachedData) {
        const data = JSON.parse(cachedData)

        if(data.invalid) {
            await cacheSetter.query({type:'incr',key:`${requestIp}RL`})
            res.statusCode = 404;
            const {invalid, ...data2} = data
            res.json({...data2});
            return
        }

        await cacheSetter.query({type:'incr',key:`${requestIp}RL`})
        res.json({ success: true, data });
        return;
    }

    const getQuery = req.query.get
    const data = ipDataService.getData(ip)

    if(getQuery){
        // @ts-ignore
        const dataToReturn = getQuery?.split(",")
        const newData = {}
        for (const item of dataToReturn) {
            // @ts-ignore
            newData[item] = null;
        }

        if (!data) {
            res.json({success:false,message:"Reserved range/Invalid IP address"})
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
            await cacheSetter.query({type:"set",key:`${requestIp}RL`,expiry: 25_92_000, value:"1"})
            await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(data || {success:false,message:"Reserved range/Invalid IP address",invalid:true}), expiry: 1800 });
            res.json({ success: true, data:newData })
            return;
        }
    }

    await cacheSetter.query({type:'incr',key:`${ip}RL`})
    await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(data || {success:false,message:"Reserved range/Invalid IP address",invalid:true}), expiry: 1800 });
    res.json({ success: true, data })
}

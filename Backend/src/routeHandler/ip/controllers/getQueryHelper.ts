import { cacheSetter } from '../../../services/servicesExport.js';
import { Response } from 'express';
import {IpGeoResponse} from "../../../services/ip/ipData";

type QueryHelper = {
    getQuery: string,
    ip: string,
    data: IpGeoResponse | null | false,
    lookUpIP: string | undefined,
    res: Response,
}

export async function getQueryHelper({getQuery, ip, data, lookUpIP, res}:QueryHelper){
    const dataToReturn = getQuery?.split(",")
    const newData = {}
    for (const item of dataToReturn) {
        // @ts-ignore
        newData[item] = null;
    }

    if (!data) {
        res.json({success:false,message:"Reserved range/Invalid IP address"})
        return;
    }

    if(dataToReturn.length > 0){
        for (const item of dataToReturn) {
            // @ts-ignore
            if(data[item]){
                // @ts-ignore
                newData[item] = data[item];
            }
        }
        await cacheSetter.query({type:"set", key:`${lookUpIP}RL`, expiry: 25_92_000, value:"1"})
        await cacheSetter.query({ type: 'set', key: `${ip}D`, value: JSON.stringify(data || {success:false,message:"Reserved range/Invalid IP address",invalid:true}), expiry: 1800 });
        res.json({ success: true, data:newData })
        return;
    }
}
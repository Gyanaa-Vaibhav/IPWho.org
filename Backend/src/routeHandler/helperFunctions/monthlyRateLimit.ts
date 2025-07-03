import {Response} from "express";
import {cacheSetter} from "../../services/servicesExport.js";

export async function monthlyRateLimit(res: Response,rateLimit: number,lookUpIP:string,customLimit:number = 100_000){
    if(rateLimit && rateLimit > customLimit) {
        res.statusCode = 429;
        res.json({ success: false, message:"Monthly Limit Exceed"});
        return;
    }else if(!rateLimit){
        await cacheSetter.query({type:"set",value:"0",key:`${lookUpIP}RL`,expiry: 25_92_000})
    }
}
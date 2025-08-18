// Controller for status
import { Request, Response } from 'express';
import {getWeekService,getMonthService,getTodayService,cacheSetter,cacheGetter} from "../../../services/servicesExport.js";
import path from "node:path";
import {__dirname} from '../../../app.js';

export async function renderStatus (req:Request, res:Response) {
    res.sendFile(path.resolve(__dirname,'..','frontendBuild','status','index.html'));
    // res.send('Render status page here');
}

export async function getStatus(req:Request, res:Response) {
    const todayData = await getTodayService.query()
    const weekData = await getWeekService.query()
    const monthData = await getMonthService.query()
    const data = {today:todayData.rows,week:weekData.rows,month:monthData.rows};
    res.json({success:true,data:data});
}

export async function getToday(req:Request, res:Response) {
    const cachedData = await cacheGetter.query({type:"get",key:"todayStatusData"})
    if(cachedData){
        res.json({success:true,data:JSON.parse(cachedData)})
        return
    }
    const data = await getTodayService.query()
    await cacheSetter.query({type:"set",key:"todayStatusData",value:JSON.stringify(data.rows),expiry:1800});
    res.json({success:true,data:data.rows});
}

export async function getWeek(req:Request, res:Response) {
    const cachedData = await cacheGetter.query({type:"get",key:"weekStatusData"})
    if(cachedData){
        res.json({success:true,data:JSON.parse(cachedData)})
        return
    }
    const data = await getWeekService.query()
    await cacheSetter.query({type:"set",key:"weekStatusData",value:JSON.stringify(data.rows),expiry:10800});
    res.json({success:true,data:data.rows});
}

export async function getMonth(req:Request, res:Response) {
    const cachedData = await cacheGetter.query({type:"get",key:"monthStatusData"})
    if(cachedData){
        res.json({success:true,data:JSON.parse(cachedData)})
        return
    }
    const data = await getMonthService.query();
    await cacheSetter.query({type:"set",key:"monthStatusData",value:JSON.stringify(data.rows),expiry:10800});
    res.json({success:true,data:data.rows});
}


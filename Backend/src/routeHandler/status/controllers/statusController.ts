// Controller for status
import { Request, Response } from 'express';
import {getWeekService,getMonthService,getTodayService} from "../../../services/servicesExport.js";

export async function renderStatus (req:Request, res:Response) {
    res.send('Render status page here');
}

export async function getStatus(req:Request, res:Response) {
    const todayData = await getTodayService.query()
    const weekData = await getWeekService.query()
    const monthData = await getMonthService.query()
    const data = {today:todayData.rows,week:weekData.rows,month:monthData.rows};
    res.json({success:true,data:data});
}

export async function getToday(req:Request, res:Response) {
    const data = await getTodayService.query()
    res.json({success:true,data:data.rows});
}

export async function getWeek(req:Request, res:Response) {
    const data = await getWeekService.query()
    res.json({success:true,data:data.rows});
}

export async function getMonth(req:Request, res:Response) {
    const data = await getMonthService.query();
    res.json({success:true,data:data.rows});
}


// Controller for metrics
import { Request, Response } from 'express';
import {monitoringService} from "../../../services/monitorService/monitorService.js";

export async function renderMetrics (req:Request, res:Response) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="metrics"');
        res.status(401).send('Unauthorized');
        return
    }

    // Decode base64
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Validate
    if (username !== 'prometheus' || password !== 'mysecretpass') {
        res.status(401).send('Unauthorized');
        return
    }
    try {
        res.set('Content-Type', monitoringService.getContentType());
        const metrics = await monitoringService.getMetricsData()
        res.send(metrics);
    } catch (err: unknown) {
        console.log(err)
        res.status(500).send('Error collecting metrics');
    }
}

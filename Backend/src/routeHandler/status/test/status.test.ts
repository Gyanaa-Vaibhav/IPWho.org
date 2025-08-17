import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../../app.js";
import {Database} from "../../../services/databaseService/databaseExports.js";

const db = Database.getInstance();
const rows = await db.query(`INSERT INTO uptime_logs (log_date, log_time, up)
SELECT
    gs::date,
    gs,
    (RANDOM() < 0.98)
FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '10 seconds') gs;`)
console.log(rows);

describe('status Route', () => {
    it('should render the status page', async () => {
        const res = await request(app).get('/status');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Render status page here');
    });

    it('should return the today status data', async () => {
        const res = await request(app).get('/status/today');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({success:true});
        expect(res.body.data.length).toBe(24);
    });

    it('should return the week status data', async () => {
        const res = await request(app).get('/status/week');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({success:true});
        expect(res.body.data.length).toBe(7);
    });

    it('should return the month status data', async () => {
        const res = await request(app).get('/status/month');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({success:true});
        expect(res.body.data.length).toBe(31);
    });
});

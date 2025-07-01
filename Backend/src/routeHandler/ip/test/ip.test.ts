import request from 'supertest';
import express from 'express';
import { describe, it, expect } from 'vitest';
import { ipRouter } from '../routes/ipRoute.js';
import { ipDataService } from '../../../services/servicesExport.js';

const app = express();
app.use('/ip', ipRouter);

const ipForTest = "12.32.4.2"

describe('ip Route', () => {
    it('should throw error on empty IP address', async () => {
        const res = await request(app).get('/ip');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Invalid IP address"});
    });

    it('should return correct country', async () => {
        const res = await request(app).get('/ip/12.32.4.2');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            success: true,
            data: expect.objectContaining({
                city: "Pittsburgh",
                continent: "North America",
                country: "United States",
            }),
        }));
    });
    
    it('should match all the objects', async () => {
        const res = await request(app).get('/ip/12.32.4.2');
        const { current_time, ...timesplit } = (res.body.data.timezone);
        const { timezone, ...data } = (res.body.data)
        const resonseObject = {
            success: true,
            data: { ...data, timezone: timesplit }
        }

        let expectedResultObject = null;
        (() => {
            const Data = ipDataService.getData(ipForTest)
            const { current_time, ...timesplit } = Data?.timezone
            const { timezone, ...result } = Data
            expectedResultObject = {
                success: true,
                data: { ...result, timezone: timesplit }
            }
        })()
        
        
        expect(res.statusCode).toBe(200);
        expect(resonseObject).toEqual({...expectedResultObject});
    });

    it("should throw error on Reserved range/Invalid IP address address", async () => {
        const res = await request(app).get('/ip/12.32.4.21212');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Reserved range/Invalid IP address"});
    })

});

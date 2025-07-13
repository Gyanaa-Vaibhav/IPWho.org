import request from 'supertest';
import express from 'express';
import { describe, it, expect } from 'vitest';
import { ipRouter } from '../routes/ipRoute.js';
import { ipDataService,cacheSetter,cacheGetter } from '../../../services/servicesExport.js';

const app = express();
app.set('trust proxy', true);
app.use('/ip', ipRouter);

describe('ip Route', () => {
    it('should throw error on empty IP address', async () => {
        const res = await request(app).get('/ip');

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Invalid IP address"});
    });

    it('should return correct country', async () => {
        const res = await request(app).get('/ip/12.32.4.2?get=city,continent,country');
        const Data = ipDataService.getData("12.32.4.2")

        if(!Data) {
            throw new Error("Test failed: No data found for IP 12.32.4.2");
        }

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            success: true,
            data: expect.objectContaining({
                city: Data?.city,
                continent: Data?.continent,
                country: Data?.country,
            }),
        }));
    });
    
    it('should match all the objects', async () => {
        const res = await request(app).get('/ip/12.32.4.2');
        const { current_time, ...timesplit } = (res.body.data.timezone);
        const { timezone, ...data } = (res.body.data)
        const responseObject = {
            success: true,
            data: { ...data, timezone: timesplit }
        }

        let expectedResultObject = null;
        (() => {
            const Data = ipDataService.getData("12.32.4.2")
            if(!Data) return null;
            const { current_time, ...remainingTimeData } = Data?.timezone
            const { timezone, ...result } = Data
            expectedResultObject = {
                success: true,
                data: { ...result, timezone: remainingTimeData }
            }
        })()

        expect(res.statusCode).toBe(200);
        expect(responseObject).toEqual({...expectedResultObject});
    });

    it("should throw error on Reserved range/Invalid IP address address", async () => {
        await cacheSetter.query({type:"del",key:"1232.32.4.21212D"})
        const res = await request(app).get('/ip/1232.32.4.21212');
        console.log(res.body)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Reserved range/Invalid IP address"});
    })

    it("Should throw and Rate Limit Exceed Error",async ()=>{
        await cacheSetter.query({type:"set",value:"1000000",key:`123.123.123.123RL`,expiry: 25_92_000})
        const res = await request(app).get('/ip/12.32.4.23').set("X-Forwarded-For","123.123.123.123");

        expect(res.statusCode).toBe(429);
        expect(res.body).toEqual({success:false, message:"Monthly Limit Exceed"});
    })

    it("Should Count Correct user requests",async ()=>{
        await cacheSetter.query({type:"del",key:"1.1.1.1RL"})
        for(let i = 1; i <= 1000; i++){
            await request(app).get('/ip/12.32.4.21').set("X-Forwarded-For","1.1.1.1");
        }
        const rateLimitCounter = await cacheGetter.query({type:"get",key:"1.1.1.1RL"})

        expect(Number(rateLimitCounter)).toBe(1000)
    })
});


import request from 'supertest';
import { Request } from 'express';
import { describe, it, expect } from 'vitest';
import { ipRouter } from '../routes/ipRoute.js';
import { ipDataService,cacheSetter } from '../../../services/servicesExport.js';
import { app } from '../../../app.js';

app.set('trust proxy', true);
app.use('/ip', ipRouter);


const mockReq = {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  } as unknown as Request;

describe('ip Route', () => {
    it('should throw error on empty IP address', async () => {
        const res = await request(app).get('/ip');

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Invalid IP address"});
    });

    it('should return correct country', async () => {
        const res = await request(app).get('/ip/12.32.4.2?get=city,continent,country');
        const Data = ipDataService.getData("12.32.4.2", mockReq)

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
        const { current_time:_current_time, ...timesplit } = (res.body.data.timezone);
        const { timezone:_timezone, ...data } = (res.body.data)
        const responseObject = {
            success: true,
            data: { ...data, timezone: timesplit }
        }

        let expectedResultObject = null;
        (() => {
            const Data = ipDataService.getData("12.32.4.2", mockReq)
            if(!Data) return null;
            const { current_time:_current_time, ...remainingTimeData } = Data?.timezone
            const { timezone:_timezone, ...result } = Data
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
});


import request from 'supertest';
import express from 'express';
import { describe, it, expect } from 'vitest';
import {ipRouter} from '../routes/ipRoute.js';

const app = express();
app.use('/ip', ipRouter);

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
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "success": true,
            "data": {
                "ip": "12.32.4.2",
                "continent": "North America",
                "continentCode": "NA",
                "country": "United States",
                "countryCode": "US",
                "capital": "Washington",
                "region": "Pennsylvania",
                "regionCode": "PA",
                "city": "Pittsburgh",
                "postal_Code": "15212",
                "time_zone": "America/New_York",
                "latitude": 40.4422,
                "longitude": -79.9927,
                "accuracy_radius": 20,
                "is_in_eu": false,
                "dial_code": "+1",
                "flag": "🇺🇸",
                "flag_unicode": "U+1F1FA U+1F1F8",
                "currency": {
                    "code": "USD",
                    "symbol": "$",
                    "name": "US Dollar",
                    "name_plural": "US dollars"
                },
                "asn": {
                    "number": 7018,
                    "org": "ATT-INTERNET4"
                }
            }
        });
    });

    it("should throw error on Reserved range/Invalid IP address address", async () => {
        const res = await request(app).get('/ip/12.32.4.21212');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({success:false, message:"Reserved range/Invalid IP address"});
    })

});

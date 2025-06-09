import request from 'supertest';
import express from 'express';
import {meRouter} from '../routes/meRoute.js';
import { describe, it, expect } from 'vitest';

const app = express();
app.use('/me', meRouter);

describe('me Route', () => {
    it('should render the me page', async () => {
        const res = await request(app).get('/me');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({success:false,message:"Invalid/Reserved IP"});
    });
});

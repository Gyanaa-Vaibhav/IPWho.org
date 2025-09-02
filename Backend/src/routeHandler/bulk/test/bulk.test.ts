import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../../app.js';


describe('bulk Route', () => {
    it("should return bulk end points",async () => {
        const res = await request(app).get('/bulk/8.8.8.8,1.1.1.1');
        expect(res.statusCode).toBe(200);
    })
});

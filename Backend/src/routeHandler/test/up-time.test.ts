import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../app.js";

describe("Testing the /up-time route", async ()=>{
    it("Should return true", async () => {
        const res = await request(app).get('/up-time')
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({success:true})
    })
})
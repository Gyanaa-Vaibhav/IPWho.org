import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../app.js";

describe("Testing the /health route", async ()=>{
    it("Should return true", async () => {
        const res = await request(app).get('/health')
        expect(res.status).toBe(200)
        expect(res.text).toBe("Working")
    })
})
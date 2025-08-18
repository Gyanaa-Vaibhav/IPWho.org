import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../app.js";

describe("Home Route Test",async()=>{
    it("Should Match the Title on landing page",async () => {
        const res = await request(app).get('/')
        expect(res.text).toContain('<title>Free IP Geolocation API — IPWho.org | </title>')
    })

    it("Should Match the Meta description on landing page",async () => {
        const res = await request(app).get('/')
        expect(res.text).toContain('<meta name="description" content="Free and fast IP geolocation API with JSON output. Get country, city, ASN, currency, and more. No API key, no Sign-up needed.">')
    })
})

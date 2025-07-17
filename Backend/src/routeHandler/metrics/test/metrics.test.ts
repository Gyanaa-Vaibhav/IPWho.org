import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../../app.js";
import {cacheSetter } from '../../../services/servicesExport.js';

describe('metrics Route', () => {
    it('Should Test the http request counter', async () => {
        await cacheSetter.query({type:"del",key:"12.2.3.4D"})
        await cacheSetter.query({type:"del",key:"127.0.0.1RL"})
        for(let i = 0 ; i < 10; i++){
            await request(app).get('/ip/12.2.3.4');
        }
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_http_request Http Requests');
        expect(res.text).toContain('# TYPE ipWho_http_request counter');
        expect(res.text).toContain('ipWho_http_request{method="GET",route="/ip",status="200"} 10');
    });

    it('should check if cache hit counter is working', async () => {
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_cache_hits_total Total Cache Hits');
        expect(res.text).toContain('# TYPE ipWho_cache_hits_total counter');
        // Cache is hitting the IP 12.2.3.4 19 times as first request will be a miss
        expect(res.text).toContain('ipWho_cache_hits_total{key="ipData"} 9');
    });

    it('should check if cache hit counter is working', async () => {
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_cache_misses_total Total Cache Misses');
        expect(res.text).toContain('# TYPE ipWho_cache_misses_total counter');
        // Cache is hitting the IP 12.2.3.4 1 times as remaining will be hit
        expect(res.text).toContain('ipWho_cache_misses_total{key="ipData"} 1');
    });

    it("Should test the queries on the /ip route", async () => {
        for(let i = 0 ; i < 5; i++){
            await request(app).get('/ip/12.2.3.4?format=json');
            await request(app).get('/ip/12.2.3.4?format=csv');
            await request(app).get('/ip/12.2.3.4?format=xml');
            await request(app).get('/ip/12.2.3.4?format=xml&get=country');
        }
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.text).toContain('# HELP ipWho_http_request Http Requests');
        expect(res.text).toContain('# TYPE ipWho_http_request counter');
        expect(res.text).toContain('ipWho_http_request{method="GET",route="/ip?format=json",status="200"} 5');
        expect(res.text).toContain('ipWho_http_request{method="GET",route="/ip?format=csv",status="200"} 5');
        expect(res.text).toContain('ipWho_http_request{method="GET",route="/ip?format=xml",status="200"} 5');
        expect(res.text).toContain('ipWho_http_request{method="GET",route="/ip?format=xml&get=country",status="200"} 5');
    })

    it("Should track the hits for the /ip route by IP",async ()=>{
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.text).toContain('# HELP ipWho_ip_service_users Tracks hits for /ip route tracking the requestor\'s IP');
        expect(res.text).toContain('# TYPE ipWho_ip_service_users counter');
        expect(res.text).toContain('ipWho_ip_service_users{ip="127.0.0.1"} 30');
    })

    it("Should track non repeating Visitors for the website or /me route", async () => {
        await cacheSetter.query({type:'del',key:'120.120.120.120RL'})
        await cacheSetter.query({type:'del',key:'121.121.121.121RL'})
        await cacheSetter.query({type:'del',key:'122.122.122.122RL'})
        await cacheSetter.query({type:'del',key:'123.123.123.123RL'})
        await cacheSetter.query({type:'del',key:'124.124.124.124RL'})
        for(let i = 0 ; i < 5; i++) {
            await request(app).get('/me').set("X-Forwarded-For",`12${i}.12${i}.12${i}.12${i}`);
        }
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');
        expect(res.text).toContain('# HELP ipWho_non_repeating_visitors Tracks unique users with /me route');
        expect(res.text).toContain('# TYPE ipWho_non_repeating_visitors counter');
        expect(res.text).toContain('ipWho_non_repeating_visitors{ip="120.120.120.120"} 1');
        expect(res.text).toContain('ipWho_non_repeating_visitors{ip="121.121.121.121"} 1');
        expect(res.text).toContain('ipWho_non_repeating_visitors{ip="122.122.122.122"} 1');
        expect(res.text).toContain('ipWho_non_repeating_visitors{ip="123.123.123.123"} 1');
        expect(res.text).toContain('ipWho_non_repeating_visitors{ip="124.124.124.124"} 1');
    })

    it('should reflect active requests during long request', async () => {
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_http_active_requests Total Active Requests');
        expect(res.text).toContain('# TYPE ipWho_http_active_requests gauge');
        expect(res.text).toContain('ipWho_http_active_requests{route="/metrics"} 1');
    });

    it("Should reflect total number of HTTP Requests", async () => {
        const num = Math.floor(Math.random() * 50);
        for (let i = 1 ; i <= num; i++) {
            await request(app).get("/")
        }
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');

        console.log(res.text)
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_http_total_request Total Http Requests');
        expect(res.text).toContain('# TYPE ipWho_http_total_request counter');
        expect(res.text).toContain(`ipWho_http_total_request ${42 + num}`);
    })
});

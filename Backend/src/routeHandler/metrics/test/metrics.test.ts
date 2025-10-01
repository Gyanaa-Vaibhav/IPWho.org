import request from 'supertest';
import { describe, it, expect } from 'vitest';
import {app} from "../../../app.js";
import {cacheSetter } from '../../../services/servicesExport.js';

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

export const userAgents = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  android: 'Mozilla/5.0 (Linux; Android 11; Pixel 5 Build/RQ3A.210905.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Mobile Safari/537.36',
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  bot: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
};

describe('/metrics Route', () => {
    it('Should Test the http request counter', async () => {
        await cacheSetter.query({type:"del",key:"12.2.3.4D"})
        await cacheSetter.query({type:"del",key:"127.0.0.1RL"})
        for(let i = 0 ; i < 10; i++){
            await request(app).get('/ip/12.2.3.4').set('User-Agent', userAgents.iphone);
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
            await request(app).get('/ip/12.2.3.4?format=json').set('User-Agent', userAgents.android);
            await request(app).get('/ip/12.2.3.4?format=csv').set('User-Agent', userAgents.windows);
            await request(app).get('/ip/12.2.3.4?format=xml').set('User-Agent', userAgents.bot);
            await request(app).get('/ip/12.2.3.4?format=xml&get=country').set('User-Agent', userAgent);
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
        expect(res.text).toContain('ipWho_ip_service_users{ip="127.0.0.1"} 1');
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
            await request(app)
                .get("/")
                .set('User-Agent', userAgent);
        }
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_http_total_request Total Http Requests');
        expect(res.text).toContain('# TYPE ipWho_http_total_request counter');
        expect(res.text).toContain(`ipWho_http_total_request ${36 + num}`);
    })

    it("Should Check if Demoprapgics is working", async()=>{
        await cacheSetter.query({type:"del",key:"69.12.12.12RL"})
        await cacheSetter.query({type:"del",key:"49.12.12.12RL"})
        await cacheSetter.query({type:"del",key:"129.12.12.12RL"})
        await cacheSetter.query({type:"del",key:"43.2.3.34D"})
        await cacheSetter.query({type:"del",key:"63.2.3.34D"})
        await cacheSetter.query({type:"del",key:"133.2.3.34D"})
        await request(app).get('/ip/43.2.3.34').set("X-Forwarded-For",`69.12.12.12`).set('User-Agent', userAgents.android);
        await request(app).get('/ip/63.2.3.34').set("X-Forwarded-For",`49.12.12.12`).set('User-Agent', userAgents.windows);
        await request(app).get('/ip/133.2.3.34').set("X-Forwarded-For",`129.12.12.12`).set('User-Agent', userAgents.mac);
        const res = await request(app).get('/metrics').set('authorization', 'Basic cHJvbWV0aGV1czpteXNlY3JldHBhc3M=');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('# HELP ipWho_user_demographic_tracker Tracks users Demopraphic');
        expect(res.text).toContain('# TYPE ipWho_user_demographic_tracker counter');
        expect(res.text).toContain('ipWho_user_demographic_tracker{location="United States",device="mobile",os="iOS"} 1');
        expect(res.text).toContain('ipWho_user_demographic_tracker{location="Singapore",device="mobile",os="Android"} 1');
        expect(res.text).toContain('ipWho_user_demographic_tracker{location="United States",device="desktop",os="Windows"} 1');
        expect(res.text).toContain('ipWho_user_demographic_tracker{location="Japan",device="desktop",os="macOS"} 1');
    })
});

//describe("/push gateway test", async()=>{
//    it("should get metrics page", async ()=>{
//        const res = await request("http://ipwho-pushgateway:9091").get('/metrics')
//        console.log(res.text)
//    })
//})

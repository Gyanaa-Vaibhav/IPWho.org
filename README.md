# IPWho.org — Free, Fast IP Geolocation API

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Dockerized](https://img.shields.io/badge/Docker-Ready-blue.svg)](./docker-compose.yml)
[![API](https://img.shields.io/badge/API-Open-green.svg)](#api-overview)
![Processed Over](https://img.shields.io/badge/Processed_Over-2M_IP's-blue.svg)

**IPWho.org** is an open-source IP geolocation API that returns rich location + network metadata (continent → ASN → currency) with no API key, no signup. Dockerized, TypeScript-based, production-ready.

Live (example):
```
https://ipwho.org/ip/8.8.8.8
```

---

### Features
- Zero auth / zero signup – instant usage. 
- Fast lookups with Redis caching. 
- Bulk queries: request multiple IPs in a single call. 
- Field filtering to reduce payload size. 
- Portable: simple Docker Compose (dev & prod). 
- Watch-mode dev (node --watch + modern frontend tooling). 
- Extensible data layer (MaxMind + IP2Location LITE supported).

---

### Tech Stack
| Layer      | Tech                                                 |
|------------|------------------------------------------------------|
| Backend    | Node.js · TypeScript                                 |
| Frontend   | Astro + Vite/React components                        |
| Data       | MaxMind GeoLite2, IP2Location LITE (manual download) |
| Cache      | Redis                                                |
| Containers | Docker & Docker Compose (dev/prod variants)          |


---

### API Overview

1. Single IP Lookup

   - GET /ip/:ip 
   - Example
   ```http request
    GET https://ipwho.org/ip/8.8.8.8
    ```
2. Client IP (implicit)
   - GET /me
   - Returns data for the caller’s IP.

3. Bulk Lookup
   - GET /bulk/:ip1,ip2,ip3
   - Comma-separated list (no spaces).
   - Example
    ```http request
    GET https://ipwho.org/bulk/8.8.8.8,1.1.1.1
    ```
   
4. Field Filtering
    - Add ?fields=ip,country,city,latitude,longitude to limit response keys.
   - Example
    ```http request
    GET https://ipwho.org/ip/8.8.8.8?fields=ip,country,asn
    ```
   
5. Health / Misc (if exposed)
   - If you add internal endpoints (e.g. /health) they are not guaranteed public—document them if you choose.

Note: Exact endpoint paths may evolve; keep this section in sync with code if you add more.

---

### Sample Response
```json
{
  "success": true,
  "data": {
    "ip": "36.255.18.252",
    "continent": "Asia",
    "continentCode": "AS",
    "country": "India",
    "countryCode": "IN",
    "capital": "New Delhi",
    "region": "Tamil Nadu",
    "regionCode": "TN",
    "city": null,
    "postal_Code": null,
    "dial_code": "+91",
    "is_in_eu": false,
    "latitude": 11.7342,
    "longitude": 78.9566,
    "accuracy_radius": 1000,
    "timezone": {
      "time_zone": "Asia/Kolkata",
      "abbr": "IST",
      "offset": 19800,
      "is_dst": false,
      "utc": "+05:30",
      "current_time": "2025-07-19T21:43:42+05:30"
    },
    "flag": {
      "flag_Icon": "🇮🇳",
      "flag_unicode": "U+1F1EE U+1F1F3"
    },
    "currency": {
      "code": "INR",
      "symbol": "₹",
      "name": "Indian Rupee",
      "name_plural": "Indian rupees",
      "hex_unicode": "20b9"
    },
    "connection": {
      "number": 24186,
      "org": "RailTel Corporation of India Ltd"
    },
    "security": {
      "isVpn": false,
      "isTor": false,
      "isThreat": "low"
    }
  }
}
```
Filtered example (?fields=ip,country,asn):

```json
{
  "ip": "8.8.8.8",
  "country": "United States",
  "asn": { "number": 15169, "org": "GOOGLE" }
}
```
Bulk example:
```json
{ "results":[
    {
      "ip": "8.8.8.8",
      "country": "United States",
      "asn": { "number": 15169, "org": "GOOGLE" }
    },
    {
      "ip": "1.1.1.1",
      "country": "Australia",
      "asn": { "number": 13335, "org": "CLOUDFLARENET" }
    }
  ]
}
```

---

💻 Quick Usage Examples

cURL
```bash
curl https://ipwho.org/ip/8.8.8.8
curl "https://ipwho.org/ip/8.8.8.8?fields=ip,country,asn"
curl https://ipwho.org/bulk/8.8.8.8,1.1.1.1
```
Node (fetch)
```js
const res = await fetch('https://ipwho.org/ip/8.8.8.8?fields=ip,country,asn');
const data = await res.json();
console.log(data);
```
Python

```python
import requests
r = requests.get("https://ipwho.org/ip/8.8.8.8", params={"fields":"ip,country,asn"})
print(r.json())
```

---

📂 Project Structure (High Level)
```
.
├── Backend/            # API source (TypeScript)
│   ├── src/            # App code
│   └── mainFiles/      # (Path for Geo DBs if you store them here)
├── Frontend/           # Astro + Vite/React frontend
├── docker-compose.yml          # Dev stack
├── docker-compose-prod.yml     # Production stack
├── .env.sample                 # Root env sample (ports/paths/redis)
├── Backend/.env.sample
├── Frontend/.env.sample
├── SETUP.md                    # Full setup instructions
└── README.md
```

---

### Setup

All installation / environment / deployment instructions are in [SETUP.md](./SETUP.md).
Go there for: .env variables, local dev, prod compose, volumes, troubleshooting.

---

### Performance (Context)

Designed to handle high request throughput with Redis caching and lightweight lookups. Bulk mode reduces overhead on multiple sequential client requests.

Actual performance will depend on your host resources, DB choice, and network latency.

---

### Contributing
1.	Fork
2.	Create feature branch: git checkout -b feature/x
3.	Commit: git commit -m "feat: ..."
4.	Push & PR
5.	Keep scope tight; open an issue first for larger changes

Ideas: automated DB sync scripts, proxy/VPN detection flags, rate-limit middleware refinements, monitoring hooks.

---

### License

MIT. See [LICENSE.](./LICENSE)

---

### Support

- Open an issue for bugs / feature requests
- Star the repo if this saved you time ✨

---

### Disclaimer

Geolocation accuracy is not guaranteed (standard limitation of IP-based methods). Always verify critical use cases with additional signals.

---
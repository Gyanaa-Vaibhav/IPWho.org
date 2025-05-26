# 🌍 IPWho.org — Free & Fast IP Geolocation API

**IPWho** is a powerful, open-source IP Geolocation API that gives you detailed location, network, timezone, and currency data for any IP address — all without signup. Built with performance, scalability, and developer simplicity in mind.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

### 🔗 Live API  
**→ https://ipwho.org/ip/8.8.8.8**

### 🧑‍💻 Built by  
[Gyanaa Vaibhav](https://medium.com/@gynanrudr0) — Passionate Backend Developer & System Design Specialist

---

## 🚀 Features

- 🔍 **Fast IP Lookup** — Get location, ASN, timezone, currency & more
- ⚡ **Optimized Redis Caching** — For blazing fast response times
- 🇺🇳 **Accurate Geo DBs** — Using GeoLite2 + IP2Location LITE
- 🌐 **Free Developer Access** — No keys, no signup
- 🛠️ **Clean TypeScript Codebase** — Follows SOLID, modular architecture
- 🔒 **Production-Ready Logging** — Winston logger with easy integration

---

## 📦 Example Response

```json
{
  "ip": "17.45.67.2",
  "continent": "North America",
  "country": "Canada",
  "region": "British Columbia",
  "city": "Vancouver",
  "postal_Code": "V6B",
  "time_zone": "America/Vancouver",
  "latitude": 49.282,
  "longitude": -123.1103,
  "currency": {
    "code": "CAD",
    "symbol": "CA$"
  },
  "asn": {
    "number": 714,
    "org": "APPLE-ENGINEERING"
  }
}
```

## 🧰 Tech Stack
* Backend: Node.js, Express, TypeScript
* Caching: Redis (via Singleton pattern)
* DBs: MaxMind GeoLite2, IP2Location LITE
* Logging: Winston Logger (modular, scalable)
* Frontend: Vite + React (Landing Page)

## 📁 Project Structure (Simplified)
```
├── Backend/
│   ├── src/
│   │   ├── app.ts         # Express server entry
│   │   ├── ipData.ts      # IP parsing + data aggregation
│   │   └── services/      # Caching, Logger, etc.
│   └── mainFiles/         # Excluded proprietary DBs
├── Frontend/
│   └── src/               # Vite + React landing page
├── LICENSE
├── README.md
```

## Run Locally
```
# Backend
cd Backend
npm install
npm run dev

# Frontend (optional)
cd ../Frontend
npm install
npm run dev
```
> ⚠️ Proprietary DB files (mainFiles/) not included in open source.

## How to Get the MaxMind GeoLite2 Database

ipwho.org uses MaxMind’s [GeoLite2 City](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) database for accurate IP geolocation.

Here’s how you can set it up:

---

#### 🔗 Step-by-Step Guide

1. **Create a MaxMind Account**
   → Go to [https://www.maxmind.com](https://www.maxmind.com) and sign up (free)

2. **Download the GeoLite2-City Database**
   → After logging in, visit
   [https://www.maxmind.com/en/accounts/current/license-key](https://www.maxmind.com/en/accounts/current/license-key)
   and generate your free license key.

3. **Use This Script or Download Manually**
   Run the download script:

   ```bash
   wget https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz
   ```

   Or manually download `.tar.gz` → extract `.mmdb` file.

4. **Place the File in `mainFiles/`**
   Copy the extracted `.mmdb` file into the `Backend/mainFiles/GeoLite2-City/` directory.

   ```
   Backend/
   ├── mainFiles/
   |   └── GeoLite2-City/
   │       └── GeoLite2-City.mmdb
   ```

---

> **Note**: The DB path is configured in the service file — no extra setup required once file is in place. follow same pattern with GeoLite2-ASN as well

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for more info.


## 🤝 Contribute / Collaborate

Open to collaboration, contributions, and feedback.
<!-- Contact: abc@ipwho.org -->


## 🙌 Support This Project

If you find this useful, a ⭐ on GitHub or a clap on Medium goes a long way.

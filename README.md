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
└── tsconfig.json
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

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for more info.


## 🤝 Contribute / Collaborate

Open to collaboration, contributions, and feedback.
<!-- Contact: abc@ipwho.org -->


## 🙌 Support This Project

If you find this useful, a ⭐ on GitHub or a clap on Medium goes a long way.
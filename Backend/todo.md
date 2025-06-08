### ✅ **1. Unit Tests (Core Logic)**

Use a test framework like **Vitest** or **Jest** with **Supertest** for HTTP tests.

#### 🔹 a. IP Lookup Utility Function

If you have a separate utility or service function that does the lookup (calls MaxMind/IP2Location), test:

* ✅ Valid IP returns expected location
* ✅ Invalid/malformed IP returns appropriate error
* ✅ Private/local IP (e.g., `127.0.0.1`) gives fallback response

#### 🔹 b. Redis Caching

If Redis caching is handled by a utility or middleware:

* ✅ IP gets cached after first lookup
* ✅ On second call, result is served from Redis
* ✅ Cache expires after correct TTL

Mock Redis using a library like `ioredis-mock` or isolate it with a stub.

---

### ✅ **2. Integration Tests (API Endpoints)**

Use **Supertest** for testing your Express routes.

#### 🔹 a. `/json` or main IP API route

* ✅ Should return geolocation data for a valid IP
* ✅ Should return client IP if no IP is passed (simulate real request)
* ✅ Should return error for bad IP format

#### 🔹 b. Rate Limiting (if you implemented it)

* ✅ Multiple rapid requests from the same IP should eventually hit the rate limit
* ✅ After cooldown, requests should be allowed again

---

### ✅ **3. Error Handling Tests**

Simulate bad situations:

* MaxMind DB unavailable → should fallback or throw clean error
* Redis down → should skip caching and still respond
* Internal server error → API returns consistent JSON error structure

---
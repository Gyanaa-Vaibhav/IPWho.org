# 🧠 CachingService Architecture

A modular, extensible caching layer designed for clarity, flexibility, and scalability. Built with Redis at its core, but architected to easily support other backends like Upstash, KeyDB, or Memcached.

---

## 🏗️ Components Overview

### 1. `cacheLayer.ts`
Manages a **singleton cache instance** (e.g., Redis client). Prevents duplicate connections and centralizes initialization.

### 2. `redisClient.ts`
Wraps Redis connection logic:
- Connects using `createClient()`
- Exposes `.getInstance()` to access the connected client
- Used internally by all query modules

### 3. `cacheExport.ts`
Exports the active cache client (default: `redisClient`) to the rest of the system. Swap the client here to switch cache backends.

### 4. `CacheSetter.ts`
Handles all **write-type operations**:
- `set`, `setWithExpiry`
- `hset` (hash set)
- `lset` (list set)
- `incr`, `decr`

Example:
```ts
const setter = new CacheSetter();
await setter.query({ type: 'set', key: 'foo', value: 'bar' });
await setter.query({ type: 'hset', key: 'user:1', field: 'name', value: 'Alice' });
await setter.query({ type: 'incr', key: 'pageviews' });
```

### 5. `CacheGetter.ts`
Handles all **read-type operations**:
- `get`
- `hget`
- `lindex`
- `mget`
- `keys`

Example:
```ts
const getter = new CacheGetter();
const value = await getter.query({ type: 'get', key: 'foo' });
const name = await getter.query({ type: 'hget', key: 'user:1', field: 'name' });
```

---

## 🔄 Switching Cache Clients

To use a different backend (e.g., Upstash):

### 1. Create a new client:
```ts
// upstashClient.ts
export class upstashClient {
  public static async getInstance() {
    const client = createUpstashClient(); // Your SDK setup
    await client.connect();
    return client;
  }
}
```

### 2. Swap in `cacheExport.ts`:
```ts
// OLD
export const cacheClient = redisClient;
// NEW
export const cacheClient = upstashClient;
```

---

## 🔌 Extend Query Logic

Organize query implementations per client:

```
stringQueries/
├── redis/
│   └── setGet.ts
├── upstash/
│   └── setGet.ts
└── index.ts // Exports current client's functions
```

Update `index.ts` to switch logic:

```ts
// stringQueries/index.ts
export * from './redis/setGet';
// export * from './upstash/setGet';
```

---

## ✨ Highlights

| Feature                 | Benefit                              |
|-------------------------|--------------------------------------|
| Singleton client layer  | No duplicate connections             |
| Modular query classes   | Clean separation of concerns         |
| Swappable backend       | Swap Redis/Upstash via one file      |
| Extensible architecture | Add new query types or clients fast  |

---

## 🧱 Adding More Query Types

To support other Redis data types (e.g., ZSET):

1. Create a folder: `zsetQueries/`
2. Add your methods: `zadd`, `zrange`, etc.
3. Route usage through `zsetQueries/index.ts`

---

## 📣 Summary

This system is built for scale:
- Centralized connection management
- Modular read/write logic
- Zero rewriting when swapping cache tools
- Clear developer ergonomics

Whether you're caching sessions, metadata, or real-time data, this architecture has you covered.
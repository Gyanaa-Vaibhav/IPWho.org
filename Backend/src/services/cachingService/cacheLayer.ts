import {createClient} from 'redis'
import {logError} from "../logger/loggerService";

/**
 * Core CacheLayer holder class following the Singleton pattern.
 *
 * - Stores a single Redis client instance.
 * - Enforces one-time initialization using `initialiseCache()`
 * - Use `getInstance()` to access the stored Redis client
 *
 * Designed to be extended or accessed by the Specific service class (e.g., redisClient, etc).
 */
class CacheLayer{
    private static cacheLayer:unknown

    /**
     * Returns the initialized Redis client instance.
     * Throws an error if called before initialization.
     */
    public static getInstance(){
        if(!CacheLayer.cacheLayer){
            logError("CacheLayer not initialised please initialise using CacheLayer.initialiseDB() method")
            throw new Error("CacheLayer not initialised please initialise using CacheLayer.initialiseDB() method");
        }
        return CacheLayer.cacheLayer
    }

    /**
     * Initializes the cache client instance once.
     * Subsequent calls with a new client will throw an error.
     *
     * @param client - The Redis client instance to store
     */
    public static initialiseCache(client:unknown){
        if (CacheLayer.cacheLayer && client) {
            logError("Cache already initialised")
            throw new Error("Cache already initialised");
        }
        if (!CacheLayer.cacheLayer && client) {
            CacheLayer.cacheLayer = client;
        }
    }
}

/**
 * Public Redis client accessor class.
 *
 * Ensures connection on retrieval and provides strongly typed Redis access.
 */
export class redisClient {
    /**
     * Connects and returns the Redis client instance.
     *
     * @returns {Promise<ReturnType<typeof createClient>>} Connected Redis client
     */
    public static async getInstance(): Promise<ReturnType<typeof createClient>> {
        const client = CacheLayer.getInstance() as ReturnType<typeof createClient>;

        if (!client.isOpen) {
            await client.connect(); // only connect if not already connected
        }

        return client;
    }
}

const creator = createClient();
CacheLayer.initialiseCache(creator)
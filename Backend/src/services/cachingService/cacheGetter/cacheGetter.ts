import { redisClient } from "../cacheLayer";
import { CacheInterface } from "../cacheInterface";
import { logError } from "../../logger/loggerExport";

const client = await redisClient.getInstance();

/**
 * CacheGetter handles Redis read operations.
 *
 * Supported Operations:
 * - get: Retrieve a value by key
 * - hget: Get field value from a hash
 * - lindex: Get value at index in a list
 * - mget: Get multiple values by keys
 * - keys: Get keys matching a pattern
 *
 * @example
 * const cache = new CacheGetter();
 * await cache.query({ type: 'get', key: 'foo' });
 * await cache.query({ type: 'hget', key: 'user:1', field: 'name' });
 * await cache.query({ type: 'lindex', key: 'mylist', index: 0 });
 * await cache.query({ type: 'mget', keys: ['foo', 'bar'] });
 * await cache.query({ type: 'keys', key: 'user:*' });
 */
class CacheGetter implements CacheInterface {
    private cache = client;

    /**
     * Executes a cache operation.
     * See {@link CacheGetter} for supported operations and examples.
     */
    public async query(data: {
        type?: 'get' | 'hget' | 'lindex' | 'mget' | 'keys';
        key?: string;
        keys?: string[];
        field?: string;
        index?: number;
    }): Promise<any> {
        const { type, key, keys, field, index } = data;

        switch (type) {
            case 'hget':
                if (!key || !field) {
                    logError("Key and field are required for HGET.");
                    throw new Error("Key and field are required for HGET.");
                }
                return await this.hGet(key, field);
            case 'lindex':
                if (!key || index === undefined) {
                    logError("Key and index are required for LINDEX.");
                    throw new Error("Key and index are required for LINDEX.");
                }
                return await this.lIndex(key, index);
            case 'mget':
                if (!keys || !Array.isArray(keys)) {
                    logError("Keys array is required for MGET.");
                    throw new Error("Keys array is required for MGET.");
                }
                return await this.mGet(keys);
            case 'keys':
                if (!key) {
                    logError("Key pattern is required for KEYS.");
                    throw new Error("Key pattern is required for KEYS.");
                }
                return await this.keys(key);
            case 'get':
            default:
                if (!key) {
                    logError("Key is required for GET.");
                    throw new Error("Key is required for GET.");
                }
                return await this.get(key);
        }
    }

    private async get(key: string) {
        return await this.cache.get(key);
    }

    private async hGet(key: string, field: string) {
        return await this.cache.hGet(key, field);
    }

    private async lIndex(key: string, index: number) {
        return await this.cache.lIndex(key, index);
    }

    private async mGet(keys: string[]) {
        return await this.cache.mGet(keys);
    }

    private async keys(pattern: string) {
        return await this.cache.keys(pattern);
    }
}

export const cacheGetter = new CacheGetter();

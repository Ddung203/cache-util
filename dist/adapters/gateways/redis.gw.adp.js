"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisGwAdp = void 0;
const cache_manager_1 = require("cache-manager");
const cache_manager_ioredis_yet_1 = require("cache-manager-ioredis-yet");
class RedisGwAdp {
    static getInstance(config) {
        if (!RedisGwAdp.instance) {
            RedisGwAdp.instance = new RedisGwAdp(config);
        }
        return RedisGwAdp.instance;
    }
    constructor(config) {
        this.name = 'RedisGwAdp';
        this.lockAtomicPrefixKey = 'LOCK_';
        this.defaultTtlSeconds = config.defaultTtlSeconds;
        this.lockExpiredMs = config.lockExpiredSeconds * 1000;
        this.isReadyPromise = this.initializeCache(config);
    }
    async initializeCache(config) {
        const redisOptions = {
            host: config.connection.host,
            port: config.connection.port,
            db: config.connection.db,
            keyPrefix: config.connection.basePrefix,
            ttl: this.defaultTtlSeconds * 1000,
        };
        if (config.connection.password) {
            redisOptions.password = config.connection.password;
        }
        if (config.connection.sentinels && config.connection.sentinels.length > 0) {
            redisOptions.sentinels = config.connection.sentinels;
            redisOptions.name = config.connection.name;
        }
        const store = await (0, cache_manager_ioredis_yet_1.redisStore)(redisOptions);
        this.cachingInstance = await (0, cache_manager_1.caching)(store);
    }
    async waitIsReady() {
        await this.isReadyPromise;
    }
    getName() {
        return this.name;
    }
    async getData(key) {
        await this.waitIsReady();
        const result = await this.cachingInstance.get(key);
        return result || null;
    }
    async setData(key, value, ttlSeconds = this.defaultTtlSeconds) {
        await this.waitIsReady();
        await this.cachingInstance.set(key, value, ttlSeconds * 1000);
    }
    async checkIsLocking(key) {
        await this.waitIsReady();
        const lockKey = this.lockAtomicPrefixKey + key;
        const lockValue = await this.cachingInstance.get(lockKey);
        return !!lockValue;
    }
    async clearLock(key) {
        await this.waitIsReady();
        const lockKey = this.lockAtomicPrefixKey + key;
        await this.cachingInstance.del(lockKey);
    }
}
exports.RedisGwAdp = RedisGwAdp;
//# sourceMappingURL=redis.gw.adp.js.map
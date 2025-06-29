"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGwAdp = void 0;
const cache_manager_1 = require("cache-manager");
class MemoryGwAdp {
    static getInstance(config) {
        if (!MemoryGwAdp.instance) {
            MemoryGwAdp.instance = new MemoryGwAdp(config);
        }
        return MemoryGwAdp.instance;
    }
    constructor(config) {
        this.name = 'MemoryGwAdp';
        this.lockAtomicPrefixKey = 'LOCK_';
        this.defaultTtlSeconds = config.defaultTtlSeconds;
        this.lockExpiredMs = config.lockExpiredSeconds * 1000;
        this.isReadyPromise = this.initializeCache(config);
    }
    async initializeCache(config) {
        this.cachingInstance = await (0, cache_manager_1.caching)('memory', {
            max: config.maxKeys,
            ttl: this.defaultTtlSeconds * 1000,
        });
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
exports.MemoryGwAdp = MemoryGwAdp;
//# sourceMappingURL=memory.gw.adp.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheUseCase = void 0;
const sleep_util_1 = require("../utils/sleep.util");
class CacheUseCase {
    constructor(logger, delayFetchAgainTimeMs, cacheGatewayAdapter, fetchDataUseCase) {
        this.logger = logger;
        this.delayFetchAgainTimeMs = delayFetchAgainTimeMs;
        this.cacheGatewayAdapter = cacheGatewayAdapter;
        this.fetchDataUseCase = fetchDataUseCase;
    }
    genReqId() {
        return Math.random().toString(36).substring(2, 15);
    }
    async getData(key, ttlSeconds) {
        const reqId = this.genReqId();
        const context = `${this.cacheGatewayAdapter.getName()}-${reqId}`;
        this.logger.log(`Getting data for key: ${key}`, context);
        // Check if data exists in cache
        const cachedData = await this.cacheGatewayAdapter.getData(key);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${key}`, context);
            return cachedData;
        }
        this.logger.log(`Cache miss for key: ${key}`, context);
        // Check if another process is already fetching the data
        const isLocking = await this.cacheGatewayAdapter.checkIsLocking(key);
        if (isLocking) {
            this.logger.log(`Key ${key} is locked, waiting...`, context);
            // Wait and retry
            await (0, sleep_util_1.sleep)(this.delayFetchAgainTimeMs);
            // Check cache again after waiting
            const dataAfterWait = await this.cacheGatewayAdapter.getData(key);
            if (dataAfterWait) {
                this.logger.log(`Data found after wait for key: ${key}`, context);
                return dataAfterWait;
            }
        }
        // Set lock to prevent other processes from fetching the same data
        const lockKey = key;
        const lockTtl = Math.max(...ttlSeconds);
        await this.cacheGatewayAdapter.setData(`LOCK_${lockKey}`, reqId, lockTtl);
        try {
            this.logger.log(`Fetching data for key: ${key}`, context);
            // Fetch data using the provided use case
            const freshData = await this.fetchDataUseCase.getData(key, ttlSeconds);
            // Store in each cache level with different TTLs
            for (let i = 0; i < ttlSeconds.length; i++) {
                await this.cacheGatewayAdapter.setData(key, freshData, ttlSeconds[i]);
            }
            this.logger.log(`Data cached for key: ${key}`, context);
            return freshData;
        }
        catch (error) {
            this.logger.log(`Error fetching data for key ${key}: ${error}`, context);
            throw error;
        }
        finally {
            // Clear lock
            await this.cacheGatewayAdapter.clearLock(lockKey);
            this.logger.log(`Lock cleared for key: ${key}`, context);
        }
    }
}
exports.CacheUseCase = CacheUseCase;
//# sourceMappingURL=cache.use-case.js.map
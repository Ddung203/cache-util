"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingManagerControllerAdp = void 0;
const useCases_1 = require("../../useCases");
class CachingManagerControllerAdp {
    constructor(logger, jsonParserUtil, cacheGwAdapters, delayFetchAgainTimeMs, autoParseJsonString) {
        this.logger = logger;
        this.jsonParserUtil = jsonParserUtil;
        this.cacheGwAdapters = cacheGwAdapters;
        this.delayFetchAgainTimeMs = delayFetchAgainTimeMs;
        this.autoParseJsonString = autoParseJsonString;
    }
    async getData(key, ttlSeconds, fetchDataPromise) {
        try {
            const fetchDataUseCase = this.buildFetchDataUseCase(fetchDataPromise);
            // Use the first cache adapter as primary
            const primaryCacheAdapter = this.cacheGwAdapters[0];
            const cacheUseCase = new useCases_1.CacheUseCase(this.logger, this.delayFetchAgainTimeMs, primaryCacheAdapter, fetchDataUseCase);
            const result = await cacheUseCase.getData(key, ttlSeconds);
            if (this.autoParseJsonString) {
                const [error, parsedResult] = this.jsonParserUtil.parse(result);
                if (!error) {
                    return parsedResult;
                }
            }
            return result;
        }
        catch (error) {
            this.logger.log(`Error in getData: ${error}`, 'CachingManagerControllerAdp');
            throw error;
        }
    }
    buildFetchDataUseCase(fetchDataPromise) {
        const lastFetchDataUseCase = new useCases_1.LastFetchDataUseCase(fetchDataPromise);
        return new useCases_1.ParserUseCase(this.jsonParserUtil, this.autoParseJsonString, lastFetchDataUseCase);
    }
}
exports.CachingManagerControllerAdp = CachingManagerControllerAdp;
//# sourceMappingURL=caching-manager.controller.adp.js.map
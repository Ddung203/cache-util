"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingManagerControllerAdpBuilder = void 0;
const controllers_1 = require("./adapters/controllers");
const gateways_1 = require("./adapters/gateways");
const json_parser_util_1 = require("./utils/json-parser.util");
class CachingManagerControllerAdpBuilder {
    constructor(options) {
        this.cacheGwAdapters = [];
        this.delayFetchAgainTimeMs = 1000;
        this.enableLog = true;
        this.autoParseJsonString = true;
        if (options) {
            this.delayFetchAgainTimeMs = options.delayFetchAgainTimeMs ?? this.delayFetchAgainTimeMs;
            this.enableLog = options.enableLog ?? this.enableLog;
            this.autoParseJsonString = options.autoParseJsonString ?? this.autoParseJsonString;
        }
    }
    registerMemory(config) {
        const memoryGwAdp = gateways_1.MemoryGwAdp.getInstance(config);
        this.cacheGwAdapters.push(memoryGwAdp);
        return this;
    }
    registerRedis(config) {
        const redisGwAdp = gateways_1.RedisGwAdp.getInstance(config);
        this.cacheGwAdapters.push(redisGwAdp);
        return this;
    }
    build() {
        if (this.cacheGwAdapters.length === 0) {
            throw new Error('At least one cache adapter must be registered!');
        }
        const logger = new gateways_1.ConsoleLoggerGwAdp();
        const jsonParserUtil = new json_parser_util_1.JSONParserUtil();
        return new controllers_1.CachingManagerControllerAdp(logger, jsonParserUtil, this.cacheGwAdapters, this.delayFetchAgainTimeMs, this.autoParseJsonString);
    }
}
exports.CachingManagerControllerAdpBuilder = CachingManagerControllerAdpBuilder;
//# sourceMappingURL=caching-manager.controller.adp.builder.js.map
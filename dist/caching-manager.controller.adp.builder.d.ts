import { CachingManagerControllerAdp } from './adapters/controllers';
import { ICachingManagerOptions, IMemoryConfig, IRedisConfig } from './configurations';
export declare class CachingManagerControllerAdpBuilder {
    private cacheGwAdapters;
    private delayFetchAgainTimeMs;
    private enableLog;
    private autoParseJsonString;
    constructor(options?: ICachingManagerOptions);
    registerMemory(config: IMemoryConfig): this;
    registerRedis(config: IRedisConfig): this;
    build(): CachingManagerControllerAdp;
}
//# sourceMappingURL=caching-manager.controller.adp.builder.d.ts.map
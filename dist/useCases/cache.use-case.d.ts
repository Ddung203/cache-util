import { AbstractCacheUseCase, AbstractFetchDataUseCase, AbstractLoggerGwAdp, ICacheGwAdp } from '../abstracts';
export declare class CacheUseCase implements AbstractCacheUseCase {
    private readonly logger;
    private readonly delayFetchAgainTimeMs;
    private readonly cacheGatewayAdapters;
    private readonly fetchDataUseCase;
    constructor(logger: AbstractLoggerGwAdp, delayFetchAgainTimeMs: number, cacheGatewayAdapters: ICacheGwAdp[], // Mảng adapters
    fetchDataUseCase: AbstractFetchDataUseCase);
    private genReqId;
    getData(key: string, ttlSeconds: number[]): Promise<string>;
    private backfillHigherLevelCaches;
    private fetchFreshData;
    private validateTtlOrdering;
}
//# sourceMappingURL=cache.use-case.d.ts.map
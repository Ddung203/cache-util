import { AbstractCacheUseCase, AbstractFetchDataUseCase, AbstractLoggerGwAdp, ICacheGwAdp } from '../abstracts';
export declare class CacheUseCase implements AbstractCacheUseCase {
    private readonly logger;
    private readonly delayFetchAgainTimeMs;
    private readonly cacheGatewayAdapter;
    private readonly fetchDataUseCase;
    constructor(logger: AbstractLoggerGwAdp, delayFetchAgainTimeMs: number, cacheGatewayAdapter: ICacheGwAdp, fetchDataUseCase: AbstractFetchDataUseCase);
    private genReqId;
    getData(key: string, ttlSeconds: number[]): Promise<string>;
}
//# sourceMappingURL=cache.use-case.d.ts.map
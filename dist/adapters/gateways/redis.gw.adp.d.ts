import { ICacheGwAdp } from '../../abstracts';
import { IRedisConfig } from '../../configurations';
export declare class RedisGwAdp implements ICacheGwAdp {
    static instance: RedisGwAdp;
    static getInstance(config: IRedisConfig): RedisGwAdp;
    private readonly name;
    private readonly lockAtomicPrefixKey;
    private readonly defaultTtlSeconds;
    private readonly lockExpiredMs;
    private cachingInstance;
    private isReadyPromise;
    constructor(config: IRedisConfig);
    private initializeCache;
    private waitIsReady;
    getName(): string;
    getData(key: string): Promise<string | null>;
    setData(key: string, value: string, ttlSeconds?: number): Promise<void>;
    checkIsLocking(key: string): Promise<boolean>;
    clearLock(key: string): Promise<void>;
}
//# sourceMappingURL=redis.gw.adp.d.ts.map
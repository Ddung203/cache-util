import { ICacheGwAdp } from '../../abstracts';
import { IMemoryConfig } from '../../configurations';
export declare class MemoryGwAdp implements ICacheGwAdp {
    static instance: MemoryGwAdp;
    static getInstance(config: IMemoryConfig): MemoryGwAdp;
    private readonly name;
    private readonly lockAtomicPrefixKey;
    private readonly defaultTtlSeconds;
    private readonly lockExpiredMs;
    private cachingInstance;
    private isReadyPromise;
    constructor(config: IMemoryConfig);
    private initializeCache;
    private waitIsReady;
    getName(): string;
    getData(key: string): Promise<string | null>;
    setData(key: string, value: string, ttlSeconds?: number): Promise<void>;
    checkIsLocking(key: string): Promise<boolean>;
    clearLock(key: string): Promise<void>;
}
//# sourceMappingURL=memory.gw.adp.d.ts.map
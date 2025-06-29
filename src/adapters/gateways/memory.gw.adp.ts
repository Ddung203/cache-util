import { caching } from 'cache-manager';
import { ICacheGwAdp } from '../../abstracts';
import { IMemoryConfig } from '../../configurations';

export class MemoryGwAdp implements ICacheGwAdp {
  static instance: MemoryGwAdp;
  
  static getInstance(config: IMemoryConfig): MemoryGwAdp {
    if (!MemoryGwAdp.instance) {
      MemoryGwAdp.instance = new MemoryGwAdp(config);
    }
    return MemoryGwAdp.instance;
  }

  private readonly name: string = 'MemoryGwAdp';
  private readonly lockAtomicPrefixKey: string = 'LOCK_';
  private readonly defaultTtlSeconds: number;
  private readonly lockExpiredMs: number;
  private cachingInstance: any;
  private isReadyPromise: Promise<void>;

  constructor(config: IMemoryConfig) {
    this.defaultTtlSeconds = config.defaultTtlSeconds;
    this.lockExpiredMs = config.lockExpiredSeconds * 1000;
    
    this.isReadyPromise = this.initializeCache(config);
  }

  private async initializeCache(config: IMemoryConfig): Promise<void> {
    this.cachingInstance = await caching('memory', {
      max: config.maxKeys,
      ttl: this.defaultTtlSeconds * 1000,
    });
  }

  private async waitIsReady(): Promise<void> {
    await this.isReadyPromise;
  }

  getName(): string {
    return this.name;
  }

  async getData(key: string): Promise<string | null> {
    await this.waitIsReady();
    const result = await this.cachingInstance.get(key);
    return result || null;
  }

  async setData(key: string, value: string, ttlSeconds: number = this.defaultTtlSeconds): Promise<void> {
    await this.waitIsReady();
    await this.cachingInstance.set(key, value, ttlSeconds * 1000);
  }

  async checkIsLocking(key: string): Promise<boolean> {
    await this.waitIsReady();
    const lockKey = this.lockAtomicPrefixKey + key;
    const lockValue = await this.cachingInstance.get(lockKey);
    return !!lockValue;
  }

  async clearLock(key: string): Promise<void> {
    await this.waitIsReady();
    const lockKey = this.lockAtomicPrefixKey + key;
    await this.cachingInstance.del(lockKey);
  }
} 
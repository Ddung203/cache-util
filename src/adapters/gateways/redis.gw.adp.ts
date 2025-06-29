import { caching } from 'cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ICacheGwAdp } from '../../abstracts';
import { IRedisConfig } from '../../configurations';

export class RedisGwAdp implements ICacheGwAdp {
  static instance: RedisGwAdp;

  static getInstance(config: IRedisConfig): RedisGwAdp {
    if (!RedisGwAdp.instance) {
      RedisGwAdp.instance = new RedisGwAdp(config);
    }
    return RedisGwAdp.instance;
  }

  private readonly name: string = 'RedisGwAdp';
  private readonly lockAtomicPrefixKey: string = 'LOCK_';
  private readonly defaultTtlSeconds: number;
  private readonly lockExpiredMs: number;
  private cachingInstance: any;
  private isReadyPromise: Promise<void>;

  constructor(config: IRedisConfig) {
    this.defaultTtlSeconds = config.defaultTtlSeconds;
    this.lockExpiredMs = config.lockExpiredSeconds * 1000;

    this.isReadyPromise = this.initializeCache(config);
  }

  private async initializeCache(config: IRedisConfig): Promise<void> {
    const redisOptions: any = {
      host: config.connection.host,
      port: config.connection.port,
      db: config.connection.db,
      keyPrefix: config.connection.basePrefix,
      ttl: this.defaultTtlSeconds * 1000,
    };

    if (config.connection.password) {
      redisOptions.password = config.connection.password;
    }

    if (config.connection.sentinels && config.connection.sentinels.length > 0) {
      redisOptions.sentinels = config.connection.sentinels;
      redisOptions.name = config.connection.name;
    }

    this.cachingInstance = await caching({
      store: redisStore,
      ...redisOptions,
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

  async setData(
    key: string,
    value: string,
    ttlSeconds: number = this.defaultTtlSeconds
  ): Promise<void> {
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

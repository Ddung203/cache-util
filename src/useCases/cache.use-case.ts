import {
  AbstractCacheUseCase,
  AbstractFetchDataUseCase,
  AbstractLoggerGwAdp,
  ICacheGwAdp,
} from '../abstracts';
import { sleep } from '../utils/sleep.util';

export class CacheUseCase implements AbstractCacheUseCase {
  constructor(
    private readonly logger: AbstractLoggerGwAdp,
    private readonly delayFetchAgainTimeMs: number,
    private readonly cacheGatewayAdapters: ICacheGwAdp[], // Mảng adapters
    private readonly fetchDataUseCase: AbstractFetchDataUseCase
  ) {}

  private genReqId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async getData(key: string, ttlSeconds: number[]): Promise<string> {
    this.validateTtlOrdering(ttlSeconds);

    const reqId = this.genReqId();

    // Try each cache level in order (Memory -> Redis -> ...)
    for (let i = 0; i < this.cacheGatewayAdapters.length; i++) {
      const adapter = this.cacheGatewayAdapters[i];
      const context = `${adapter.getName()}-${reqId}`;

      this.logger.log(`Getting data for key: ${key}`, context);

      const cachedData = await adapter.getData(key);
      if (cachedData) {
        this.logger.log(`Cache hit for key: ${key}`, context);

        // Backfill higher-level caches
        await this.backfillHigherLevelCaches(key, cachedData, ttlSeconds, i);

        return cachedData;
      }

      this.logger.log(`Cache miss for key: ${key}`, context);
    }

    // All cache levels missed, fetch fresh data
    return await this.fetchFreshData(key, ttlSeconds, reqId);
  }

  private async backfillHigherLevelCaches(
    key: string,
    data: string,
    ttlSeconds: number[],
    currentLevel: number
  ): Promise<void> {
    // Backfill caches at higher levels (lower index)
    for (let i = 0; i < currentLevel; i++) {
      // Use specific TTL for each level, fallback to last TTL if not enough provided
      const ttl =
        i < ttlSeconds.length
          ? ttlSeconds[i]
          : ttlSeconds[ttlSeconds.length - 1];
      await this.cacheGatewayAdapters[i].setData(key, data, ttl);
    }
  }

  private async fetchFreshData(
    key: string,
    ttlSeconds: number[],
    reqId: string
  ): Promise<string> {
    const primaryAdapter = this.cacheGatewayAdapters[0];
    const context = `${primaryAdapter.getName()}-${reqId}`;

    // Handle locking with retry mechanism
    const maxRetries = 3;
    let retryCount = 0;

    while (
      (await primaryAdapter.checkIsLocking(key)) &&
      retryCount < maxRetries
    ) {
      this.logger.log(
        `Key ${key} is locked, waiting... (retry ${
          retryCount + 1
        }/${maxRetries})`,
        context
      );
      await sleep(this.delayFetchAgainTimeMs);
      retryCount++;

      // Try all cache levels again after each wait
      for (const adapter of this.cacheGatewayAdapters) {
        const dataAfterWait = await adapter.getData(key);
        if (dataAfterWait) {
          this.logger.log(`Data found after wait for key: ${key}`, context);
          return dataAfterWait;
        }
      }
    }

    // If still locked after max retries, proceed anyway (lock might be stale)
    if (
      retryCount >= maxRetries &&
      (await primaryAdapter.checkIsLocking(key))
    ) {
      this.logger.log(
        `Lock timeout for key: ${key}, proceeding anyway`,
        context
      );
    }

    // Set lock on primary adapter
    const lockTtl = Math.max(...ttlSeconds);
    await primaryAdapter.setData(`LOCK_${key}`, reqId, lockTtl);

    try {
      this.logger.log(`Fetching data for key: ${key}`, context);

      const freshData = await this.fetchDataUseCase.getData(key, ttlSeconds);

      // Store in all cache levels with respective TTLs
      for (let i = 0; i < this.cacheGatewayAdapters.length; i++) {
        // Use specific TTL for each level, fallback to last TTL if not enough provided
        const ttl =
          i < ttlSeconds.length
            ? ttlSeconds[i]
            : ttlSeconds[ttlSeconds.length - 1];
        await this.cacheGatewayAdapters[i].setData(key, freshData, ttl);
      }

      this.logger.log(`Data cached for key: ${key}`, context);
      return freshData;
    } finally {
      await primaryAdapter.clearLock(key);
      this.logger.log(`Lock cleared for key: ${key}`, context);
    }
  }

  private validateTtlOrdering(ttlSeconds: number[]): void {
    // Validate basic requirements
    if (ttlSeconds.length === 0) {
      throw new Error('TTL array cannot be empty');
    }

    if (this.cacheGatewayAdapters.length === 0) {
      throw new Error('At least one cache adapter must be registered');
    }

    // Validate array lengths compatibility
    if (ttlSeconds.length > this.cacheGatewayAdapters.length) {
      throw new Error(
        `TTL array length (${ttlSeconds.length}) cannot exceed ` +
          `number of registered cache adapters (${this.cacheGatewayAdapters.length})`
      );
    }

    // Validate TTL values are positive
    for (let i = 0; i < ttlSeconds.length; i++) {
      if (ttlSeconds[i] <= 0) {
        throw new Error(
          `TTL at index ${i} must be greater than 0, got: ${ttlSeconds[i]}`
        );
      }
    }

    // Validate ascending order (only if multiple levels)
    for (let i = 1; i < ttlSeconds.length; i++) {
      if (ttlSeconds[i] < ttlSeconds[i - 1]) {
        throw new Error(
          `Invalid TTL ordering: Cache level ${i} TTL (${ttlSeconds[i]}s) ` +
            `must be greater than or equal to level ${i - 1} TTL (${
              ttlSeconds[i - 1]
            }s). ` +
            `TTL should increase with each cache level for proper fallback behavior.`
        );
      }
    }
  }
}

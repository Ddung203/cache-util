export abstract class AbstractCacheUseCase {
  abstract getData(key: string, ttlSeconds: number[]): Promise<string>;
} 
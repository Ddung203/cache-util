export abstract class AbstractFetchDataUseCase {
  abstract getData(key?: string, ttlSeconds?: number[]): Promise<string>;
} 
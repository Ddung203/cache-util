export abstract class AbstractLastFetchDataUseCase {
  abstract getData(key: string, ttlSeconds: number[]): Promise<string>;
} 
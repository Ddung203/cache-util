import { AbstractLastFetchDataUseCase } from '../abstracts';

export class LastFetchDataUseCase extends AbstractLastFetchDataUseCase {
  constructor(private readonly fetchDataPromise: () => Promise<any>) {
    super();
  }

  async getData(key: string, ttlSeconds: number[]): Promise<string> {
    const result = await this.fetchDataPromise();
    return typeof result === 'string' ? result : JSON.stringify(result);
  }
}

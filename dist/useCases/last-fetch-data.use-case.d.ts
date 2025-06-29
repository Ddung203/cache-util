import { AbstractLastFetchDataUseCase } from '../abstracts';
export declare class LastFetchDataUseCase extends AbstractLastFetchDataUseCase {
    private readonly fetchDataPromise;
    constructor(fetchDataPromise: () => Promise<any>);
    getData(key: string, ttlSeconds: number[]): Promise<string>;
}
//# sourceMappingURL=last-fetch-data.use-case.d.ts.map
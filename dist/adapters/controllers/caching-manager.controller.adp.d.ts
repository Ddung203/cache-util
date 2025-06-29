import { AbstractLoggerGwAdp, ICacheGwAdp } from '../../abstracts';
import { JSONParserUtil } from '../../utils/json-parser.util';
export declare class CachingManagerControllerAdp {
    private readonly logger;
    private readonly jsonParserUtil;
    private readonly cacheGwAdapters;
    private readonly delayFetchAgainTimeMs;
    private readonly autoParseJsonString;
    constructor(logger: AbstractLoggerGwAdp, jsonParserUtil: JSONParserUtil, cacheGwAdapters: ICacheGwAdp[], delayFetchAgainTimeMs: number, autoParseJsonString: boolean);
    getData(key: string, ttlSeconds: number[], fetchDataPromise: () => Promise<any>): Promise<any>;
    private buildFetchDataUseCase;
}
//# sourceMappingURL=caching-manager.controller.adp.d.ts.map
import { AbstractLoggerGwAdp, ICacheGwAdp } from '../../abstracts';
import {
  CacheUseCase,
  LastFetchDataUseCase,
  ParserUseCase,
} from '../../useCases';
import { JSONParserUtil } from '../../utils/json-parser.util';

export class CachingManagerControllerAdp {
  constructor(
    private readonly logger: AbstractLoggerGwAdp,
    private readonly jsonParserUtil: JSONParserUtil,
    private readonly cacheGwAdapters: ICacheGwAdp[],
    private readonly delayFetchAgainTimeMs: number,
    private readonly autoParseJsonString: boolean
  ) {}

  async getData(
    key: string,
    ttlSeconds: number[],
    fetchDataPromise: () => Promise<any>
  ): Promise<any> {
    try {
      const fetchDataUseCase = this.buildFetchDataUseCase(fetchDataPromise);

      const cacheUseCase = new CacheUseCase(
        this.logger,
        this.delayFetchAgainTimeMs,
        this.cacheGwAdapters,
        fetchDataUseCase
      );

      const result = await cacheUseCase.getData(key, ttlSeconds);

      if (this.autoParseJsonString) {
        const [error, parsedResult] = this.jsonParserUtil.parse<any>(result);
        if (!error) {
          return parsedResult;
        }
      }

      return result;
    } catch (error) {
      this.logger.log(
        `Error in getData: ${error}`,
        'CachingManagerControllerAdp'
      );
      throw error;
    }
  }

  private buildFetchDataUseCase(
    fetchDataPromise: () => Promise<any>
  ): ParserUseCase {
    const lastFetchDataUseCase = new LastFetchDataUseCase(fetchDataPromise);

    return new ParserUseCase(
      this.jsonParserUtil,
      this.autoParseJsonString,
      lastFetchDataUseCase
    );
  }
}

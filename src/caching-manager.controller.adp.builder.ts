import { CachingManagerControllerAdp } from './adapters/controllers';
import { ICachingManagerOptions, IMemoryConfig, IRedisConfig } from './configurations';
import { ICacheGwAdp } from './abstracts';
import { ConsoleLoggerGwAdp, MemoryGwAdp, RedisGwAdp } from './adapters/gateways';
import { JSONParserUtil } from './utils/json-parser.util';

export class CachingManagerControllerAdpBuilder {
  private cacheGwAdapters: ICacheGwAdp[] = [];
  private delayFetchAgainTimeMs: number = 1000;
  private enableLog: boolean = true;
  private autoParseJsonString: boolean = true;

  constructor(options?: ICachingManagerOptions) {
    if (options) {
      this.delayFetchAgainTimeMs = options.delayFetchAgainTimeMs ?? this.delayFetchAgainTimeMs;
      this.enableLog = options.enableLog ?? this.enableLog;
      this.autoParseJsonString = options.autoParseJsonString ?? this.autoParseJsonString;
    }
  }

  registerMemory(config: IMemoryConfig): this {
    const memoryGwAdp = MemoryGwAdp.getInstance(config);
    this.cacheGwAdapters.push(memoryGwAdp);
    return this;
  }

  registerRedis(config: IRedisConfig): this {
    const redisGwAdp = RedisGwAdp.getInstance(config);
    this.cacheGwAdapters.push(redisGwAdp);
    return this;
  }

  build(): CachingManagerControllerAdp {
    if (this.cacheGwAdapters.length === 0) {
      throw new Error('At least one cache adapter must be registered!');
    }

    const logger = new ConsoleLoggerGwAdp();
    const jsonParserUtil = new JSONParserUtil();

    return new CachingManagerControllerAdp(
      logger,
      jsonParserUtil,
      this.cacheGwAdapters,
      this.delayFetchAgainTimeMs,
      this.autoParseJsonString
    );
  }
} 
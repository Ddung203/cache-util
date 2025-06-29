import { AbstractFetchDataUseCase } from '../abstracts';
import { JSONParserUtil } from '../utils/json-parser.util';

export class ParserUseCase extends AbstractFetchDataUseCase {
  constructor(
    private readonly jsonParserUtil: JSONParserUtil,
    private readonly autoParseJsonString: boolean,
    private readonly originalFetchDataUseCase: AbstractFetchDataUseCase
  ) {
    super();
  }

  async getData(key?: string, ttlSeconds?: number[]): Promise<string> {
    const data = await this.originalFetchDataUseCase.getData(key, ttlSeconds);
    
    if (!this.autoParseJsonString) {
      return data;
    }

    const [error, result] = this.jsonParserUtil.parse<any>(data);
    if (error) {
      return data; // Return original data if parsing fails
    }

    return typeof result === 'string' ? result : JSON.stringify(result);
  }
} 
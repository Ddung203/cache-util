import { AbstractFetchDataUseCase } from '../abstracts';
import { JSONParserUtil } from '../utils/json-parser.util';
export declare class ParserUseCase extends AbstractFetchDataUseCase {
    private readonly jsonParserUtil;
    private readonly autoParseJsonString;
    private readonly originalFetchDataUseCase;
    constructor(jsonParserUtil: JSONParserUtil, autoParseJsonString: boolean, originalFetchDataUseCase: AbstractFetchDataUseCase);
    getData(key?: string, ttlSeconds?: number[]): Promise<string>;
}
//# sourceMappingURL=parser.use-case.d.ts.map
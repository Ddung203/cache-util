"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserUseCase = void 0;
const abstracts_1 = require("../abstracts");
class ParserUseCase extends abstracts_1.AbstractFetchDataUseCase {
    constructor(jsonParserUtil, autoParseJsonString, originalFetchDataUseCase) {
        super();
        this.jsonParserUtil = jsonParserUtil;
        this.autoParseJsonString = autoParseJsonString;
        this.originalFetchDataUseCase = originalFetchDataUseCase;
    }
    async getData(key, ttlSeconds) {
        const data = await this.originalFetchDataUseCase.getData(key, ttlSeconds);
        if (!this.autoParseJsonString) {
            return data;
        }
        const [error, result] = this.jsonParserUtil.parse(data);
        if (error) {
            return data; // Return original data if parsing fails
        }
        return typeof result === 'string' ? result : JSON.stringify(result);
    }
}
exports.ParserUseCase = ParserUseCase;
//# sourceMappingURL=parser.use-case.js.map
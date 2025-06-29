"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParserUtil = void 0;
class JSONParserUtil {
    parse(input) {
        try {
            const result = JSON.parse(input);
            return ['', result];
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
            return [errorMessage, null];
        }
    }
}
exports.JSONParserUtil = JSONParserUtil;
//# sourceMappingURL=json-parser.util.js.map
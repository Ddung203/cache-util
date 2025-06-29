"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastFetchDataUseCase = void 0;
const abstracts_1 = require("../abstracts");
class LastFetchDataUseCase extends abstracts_1.AbstractLastFetchDataUseCase {
    constructor(fetchDataPromise) {
        super();
        this.fetchDataPromise = fetchDataPromise;
    }
    async getData(key, ttlSeconds) {
        const result = await this.fetchDataPromise();
        return typeof result === 'string' ? result : JSON.stringify(result);
    }
}
exports.LastFetchDataUseCase = LastFetchDataUseCase;
//# sourceMappingURL=last-fetch-data.use-case.js.map
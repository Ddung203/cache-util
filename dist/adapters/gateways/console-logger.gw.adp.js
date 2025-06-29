"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLoggerGwAdp = void 0;
const abstracts_1 = require("../../abstracts");
class ConsoleLoggerGwAdp extends abstracts_1.AbstractLoggerGwAdp {
    constructor() {
        super(...arguments);
        this.name = 'ConsoleLoggerGwAdp';
    }
    log(message, context) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${this.name}] [${context}] ${message}`);
    }
}
exports.ConsoleLoggerGwAdp = ConsoleLoggerGwAdp;
//# sourceMappingURL=console-logger.gw.adp.js.map
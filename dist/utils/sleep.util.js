"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (sleepMs) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sleepMs);
    });
};
exports.sleep = sleep;
//# sourceMappingURL=sleep.util.js.map
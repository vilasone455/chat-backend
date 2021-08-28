"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class BanException extends HttpException_1.default {
    constructor() {
        super(403, 'Your account is ban');
    }
}
exports.default = BanException;
//# sourceMappingURL=BanExpection.js.map
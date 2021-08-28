"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class BadRequestExpection extends HttpException_1.default {
    constructor() {
        super(400, `Bad Request`);
    }
}
exports.default = BadRequestExpection;
//# sourceMappingURL=BadRequestExpection.js.map
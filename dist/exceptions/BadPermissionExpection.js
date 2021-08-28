"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class BadPermissionExpections extends HttpException_1.default {
    constructor() {
        super(400, `Error you are dont have permission to do this`);
    }
}
exports.default = BadPermissionExpections;
//# sourceMappingURL=BadPermissionExpection.js.map
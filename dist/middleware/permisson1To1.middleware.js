"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const AuthenticationTokenMissingException_1 = require("../exceptions/AuthenticationTokenMissingException");
const WrongAuthenticationTokenException_1 = require("../exceptions/WrongAuthenticationTokenException");
const typeorm_1 = require("typeorm");
const BadPermissionExpection_1 = require("../exceptions/BadPermissionExpection");
function permission1To1(entity, entityName) {
    return async (req, res, next) => {
        const auth = req.headers["authorization"];
        const id = req.params.id;
        if (auth) {
            try {
                const verificationResponse = jwt.verify(auth, process.env.SECRET_KEY);
                const entityRes = typeorm_1.getRepository(entity);
                const cc = entityName;
                const rs = await entityRes.findOne({ where: { [cc]: { "id": id } }, relations: [entityName] });
                if (rs) {
                    req.data = rs;
                    next();
                }
                else {
                    next(new BadPermissionExpection_1.default());
                }
            }
            catch (error) {
                console.log(error);
                next(new WrongAuthenticationTokenException_1.default());
            }
        }
        else {
            next(new AuthenticationTokenMissingException_1.default());
        }
    };
}
exports.default = permission1To1;
//# sourceMappingURL=permisson1To1.middleware.js.map
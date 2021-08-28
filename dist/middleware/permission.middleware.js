"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const AuthenticationTokenMissingException_1 = require("../exceptions/AuthenticationTokenMissingException");
const WrongAuthenticationTokenException_1 = require("../exceptions/WrongAuthenticationTokenException");
const typeorm_1 = require("typeorm");
const BadPermissionExpection_1 = require("../exceptions/BadPermissionExpection");
function validationMiddleware(entity, fieldName = "user") {
    return async (req, res, next) => {
        const auth = req.headers["authorization"];
        console.log(auth);
        const id = req.params.id;
        if (auth) {
            try {
                const verificationResponse = jwt.verify(auth, process.env.SECRET_KEY);
                const userTokenId = verificationResponse._id;
                const entityRes = typeorm_1.getRepository(entity);
                const rs = await entityRes.findOne({ where: { "user": { "id": userTokenId }, "id": id }, relations: ["user"] });
                if (rs) {
                    req.user = rs["user"];
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
exports.default = validationMiddleware;
//# sourceMappingURL=permission.middleware.js.map
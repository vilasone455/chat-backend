"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const typeorm_1 = require("typeorm");
const NoficationTb_1 = require("../entity/NoficationTb");
class NoficationController {
    constructor() {
        this.path = '/nofication';
        this.router = express_1.Router();
        this.nofiRes = typeorm_1.getRepository(NoficationTb_1.NoficationTb);
        this.allNofication = async (request, response, next) => {
            let user = request.user;
            const rs = await this.nofiRes.createQueryBuilder("n")
                .innerJoinAndSelect("n.sender", "sender")
                .innerJoinAndSelect("n.recipient", "recipient")
                .where("n.senderId = :id OR n.recipientId = :id", { id: user.id })
                .getMany();
            response.send(rs);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.default, this.allNofication);
    }
}
exports.default = NoficationController;
//# sourceMappingURL=NoficationController.js.map
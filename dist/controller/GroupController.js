"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Conversation_1 = require("../entity/Conversation");
const Group_1 = require("../entity/Group");
const GroupRequest_1 = require("../entity/GroupRequest");
const MemberShip_1 = require("../entity/MemberShip");
const User_1 = require("../entity/User");
const ConversationType_1 = require("../interfaces/ConversationType");
const MemberRole_1 = require("../interfaces/MemberRole");
const RequestStatus_1 = require("../interfaces/RequestStatus");
const auth_middleware_1 = require("../middleware/auth.middleware");
class GroupController {
    constructor() {
        this.path = '/group';
        this.router = express_1.Router();
        this.conversationRes = typeorm_1.getRepository(Conversation_1.Conversation);
        this.memberShipRes = typeorm_1.getRepository(MemberShip_1.MemberShip);
        this.groupRequestRes = typeorm_1.getRepository(GroupRequest_1.GroupRequest);
        this.findMyGroup = async (request, response, next) => {
            let user = request.user;
            let rs = await this.conversationRes.createQueryBuilder("c")
                .leftJoinAndSelect("c.group", "group")
                .leftJoinAndSelect("c.memberships", "members")
                .where("c.groupId IS NOT NULL")
                .andWhere("members.userId = :id", { id: user.id })
                .getMany();
            response.send(rs);
        };
        this.findGroup = async (request, response, next) => {
            let user = request.user;
            let rs = await this.conversationRes.createQueryBuilder("c")
                .leftJoinAndSelect("c.group", "group")
                .leftJoinAndSelect("c.memberships", "members")
                .where("c.groupId IS NOT NULL")
                .andWhere("members.userId != :id", { id: user.id })
                .getMany();
            response.send(rs);
        };
        this.acceptGroup = async (request, response, next) => {
            let id = request.params.id;
            let rq = await this.groupRequestRes.findOne({ where: { id }, relations: ["sender", "conversation"] });
            rq.status = RequestStatus_1.RequestStatus.Accept;
            await this.groupRequestRes.save(rq);
            let mem = new MemberShip_1.MemberShip();
            mem.user = request.user;
            mem.conversation = rq.conversation;
            let rs = await this.memberShipRes.save(mem);
            response.send(rs);
        };
        this.inviteGroup = async (request, response, next) => {
            let userRes = typeorm_1.getRepository(User_1.User);
            let targetUser = await userRes.findOne(request.params.userid);
            let con = await this.conversationRes.findOne(request.params.conid);
            let groupRequest = new GroupRequest_1.GroupRequest();
            groupRequest.conversation = con;
            groupRequest.sender = request.user;
            groupRequest.recipient = targetUser;
            const rs = await this.groupRequestRes.save(groupRequest);
            response.send(rs);
        };
        this.createGroup = async (request, response, next) => {
            let group = request.body;
            const groupRes = typeorm_1.getRepository(Group_1.Group);
            let g = await groupRes.save(group);
            let con = new Conversation_1.Conversation();
            let user = request.user;
            con.conversationType = ConversationType_1.ConversationType.Group;
            con.group = g;
            const rs = await this.conversationRes.save(con);
            let mem = new MemberShip_1.MemberShip();
            mem.user = user;
            mem.memberRole = MemberRole_1.MemberRole.Admin;
            mem.conversation = rs;
            this.memberShipRes.save(mem);
            response.send(con);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/accept/:id`, auth_middleware_1.default, this.acceptGroup);
        this.router.get(`${this.path}/invite/:userid/:conid`, auth_middleware_1.default, this.inviteGroup);
        this.router.post(`${this.path}`, auth_middleware_1.default, this.createGroup);
        this.router.get(`${this.path}/search`, auth_middleware_1.default, this.findGroup);
        this.router.get(`${this.path}/my`, auth_middleware_1.default, this.findMyGroup);
    }
}
exports.default = GroupController;
//# sourceMappingURL=GroupController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const typeorm_1 = require("typeorm");
const Chat_1 = require("../entity/Chat");
const pagination_1 = require("../util/pagination");
const Conversation_1 = require("../entity/Conversation");
const User_1 = require("../entity/User");
const MemberShip_1 = require("../entity/MemberShip");
class ChatController {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.chatRes = typeorm_1.getRepository(Chat_1.Chat);
        this.testcon = async (request, response, next) => {
            const memres = typeorm_1.getRepository(MemberShip_1.MemberShip);
            let rs = await memres.find({ relations: ["conversation", "user"] });
            response.send(rs);
        };
        this.getLastMessage = async (request, response, next) => {
            let pag = pagination_1.getPagination(request, 15);
            let user = request.user;
            const rs = await typeorm_1.getConnection().createQueryBuilder(Chat_1.Chat, "c")
                .leftJoin("c.sender", "sender")
                .leftJoinAndSelect("c.conversation", "con")
                .leftJoin("con.memberships", "memberships")
                .where("c.senderId = :uId OR memberships.userId = :uId", { uId: user.id })
                .select('MAX(c.id)', 'cid')
                .addSelect('MAX(c.msg)', 'msg')
                .addSelect('c.conversationId', 'd')
                .groupBy("c.conversationId")
                .skip(pag.skip)
                .take(pag.take)
                .getRawMany();
            console.log(rs);
            let msgId = [];
            rs.forEach(r => {
                msgId.push(Number(r.cid));
            });
            const msgs = await this.chatRes.createQueryBuilder("c")
                .innerJoinAndSelect("c.conversation", "conversation")
                .innerJoinAndSelect("c.sender", "sender")
                .where("c.id IN (:...chatList)", { chatList: msgId })
                .getMany();
            response.send({ val: msgs, user });
        };
        this.getChatLog = async (request, response, next) => {
            let pag = pagination_1.getPagination(request, 15);
            let user = request.user;
            let id = request.params.id;
            const rs = await this.chatRes.createQueryBuilder("c")
                .leftJoinAndSelect("c.sender", "sender")
                .leftJoin("c.conversation", "con")
                .leftJoin("con.memberships", "memberships")
                .where("(c.senderId = :uId OR memberships.userId = :uId) AND c.conversationId = :cId", { uId: user.id, cId: id })
                .orderBy("c.id", "DESC")
                .skip(pag.skip)
                .take(pag.take)
                .getMany();
            response.send(rs);
        };
        this.addMessage = async (request, response, next) => {
            let add = request.body;
            add.sender = request.user;
            const chats = await this.chatRes.save(add);
            response.send(chats);
        };
        this.allCon = async (request, response, next) => {
            const converRes = typeorm_1.getRepository(Conversation_1.Conversation);
            const chats = await converRes.createQueryBuilder("c")
                .leftJoinAndSelect("c.group", "group")
                .leftJoinAndSelect("c.members", "members")
                .getMany();
            response.send(chats);
        };
        this.allConversion = async (request, response, next) => {
            const converRes = typeorm_1.getRepository(Conversation_1.Conversation);
            const chats = await converRes.createQueryBuilder("c")
                .leftJoinAndSelect("c.members", "members")
                .where("members.userId = :uId", { uId: Number(request.user.id) })
                .getMany();
            response.send(chats);
        };
        this.allChat = async (request, response, next) => {
            const chats = await this.chatRes.find();
            response.send(chats);
        };
        this.privateChat = async (request, response, next) => {
            const userRes = typeorm_1.getRepository(User_1.User);
            let targetId = request.params.id;
            let target = await userRes.findOne(targetId);
            let user = request.user;
            const conversationRes = typeorm_1.getRepository(Conversation_1.Conversation);
            let conver = new Conversation_1.Conversation();
            conver.title = "";
            conver.members = [user, target];
            const rs = await conversationRes.save(conver);
            response.send(rs);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`/privatechat/:id`, auth_middleware_1.default, this.privateChat);
        this.router.get(`/allcon`, this.allCon);
        this.router.get(`/conversation`, auth_middleware_1.default, this.allConversion);
        this.router.get(`/testcon`, this.testcon);
        this.router.get(`/chats`, this.allChat);
        this.router.get(`/lastmsg`, auth_middleware_1.default, this.getLastMessage);
        this.router.get(`/messages/:id`, auth_middleware_1.default, this.getChatLog);
        this.router.post(`/messages`, auth_middleware_1.default, this.addMessage);
    }
}
exports.default = ChatController;
//# sourceMappingURL=ChatController.js.map
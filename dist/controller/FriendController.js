"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Friend_1 = require("../entity/Friend");
const FrientRequest_1 = require("../entity/FrientRequest");
const User_1 = require("../entity/User");
const auth_middleware_1 = require("../middleware/auth.middleware");
class FriendController {
    constructor() {
        this.path = '/friend';
        this.router = express_1.Router();
        this.friendRequestRes = typeorm_1.getRepository(FrientRequest_1.FriendRequest);
        this.friendRes = typeorm_1.getRepository(Friend_1.Friend);
        this.allRequest = async (request, response, next) => {
            const rs = await this.friendRequestRes.createQueryBuilder("f")
                .innerJoinAndSelect("f.sender", "sender")
                .innerJoinAndSelect("f.recipient", "recipient")
                .getMany();
            console.log(rs);
            response.send(rs);
        };
        this.searchFriend = async (request, response, next) => {
            const userRes = typeorm_1.getRepository(User_1.User);
            let search = request.query["search"];
            const rs = await userRes.find({
                where: { firstName: typeorm_1.Like(search) }
            });
            response.send(rs);
        };
        this.getNoneFriends = async (request, response, next) => {
            const userRes = typeorm_1.getRepository(User_1.User);
            let user = request.user;
            console.log(user);
            let fQuery = typeorm_1.getConnection()
                .createQueryBuilder(Friend_1.Friend, "f")
                .innerJoinAndSelect("f.follower", "follower")
                .innerJoinAndSelect("f.following", "following")
                .where(`(f.followerId = u.id AND f.followingId = ${user.id})`)
                .orWhere(`(f.followingId = u.id AND f.followerId = ${user.id})`)
                .getQuery();
            let rQuery = typeorm_1.getConnection()
                .createQueryBuilder(FrientRequest_1.FriendRequest, "fs")
                .innerJoinAndSelect("fs.sender", "sender")
                .innerJoinAndSelect("fs.recipient", "recipient")
                .where(`(fs.senderId = u.id AND fs.recipientId = ${user.id})`)
                .orWhere(`(fs.recipientId = u.id AND fs.senderId = ${user.id})`)
                .getQuery();
            const rs = await userRes.createQueryBuilder("u")
                .where(`NOT EXISTS (${fQuery})`)
                .andWhere(`NOT EXISTS (${rQuery})`)
                .orderBy("u.id", "DESC")
                .getMany();
            response.send(rs);
        };
        this.getFriends = async (request, response, next) => {
            let user = request.user;
            const rs = await this.friendRes.createQueryBuilder("f")
                .innerJoinAndSelect("f.follower", "follower")
                .innerJoinAndSelect("f.following", "following")
                .where("f.followerId = :id OR f.followingId = :id", { id: user.id }).getMany();
            response.send(rs);
        };
        this.rejectRequest = async (request, response, next) => {
            let id = request.params.id;
            let user = request.user;
            const rs = await this.friendRequestRes.createQueryBuilder("f")
                .where("f.id = :id", { id }).getOne();
            if (rs) {
            }
            else {
                response.status(404).send("Request Not found");
            }
        };
        this.acceptRequest = async (request, response, next) => {
            let id = request.params.id;
            let user = request.user;
            const friendRes = typeorm_1.getRepository(Friend_1.Friend);
            const rs = await this.friendRequestRes.createQueryBuilder("f")
                .innerJoinAndSelect("f.recipient", "recipient")
                .innerJoinAndSelect("f.sender", "sender")
                .where("f.id = :id", { id }).getOne();
            if (rs) {
                if (rs.recipient.id === user.id) {
                    let f = new Friend_1.Friend();
                    f.follower = user;
                    f.following = rs.sender;
                    rs.status = 2;
                    await this.friendRequestRes.save(rs);
                    const fs = await friendRes.save(f);
                    return response.send(fs);
                }
                else {
                    return response.status(400).send("Bad Request");
                }
            }
            else {
                response.status(404).send("Request not found");
            }
            response.send(rs);
        };
        this.getFriendRequest = async (request, response, next) => {
            let user = request.user;
            console.log(user);
            const rs = await this.friendRequestRes.createQueryBuilder("f")
                .innerJoinAndSelect("f.sender", "sender")
                .innerJoinAndSelect("f.recipient", "recipient")
                .where("f.senderId = :uId OR f.recipientId = :uId", { uId: Number(user.id) })
                .getMany();
            console.log(rs);
            response.send(rs);
        };
        this.sendFriendRequest = async (request, response, next) => {
            let sender = request.user;
            console.log(sender);
            console.log("send request");
            let rId = request.params.id;
            if (sender.id == Number(request.params.id))
                return response.status(400).send("Cant Request Self");
            let isHaveRequest = await this.friendRequestRes.createQueryBuilder("fs")
                .where("fs.senderId = :id OR fs.recipientId = :id", { id: Number(rId) }).getOne();
            let isBeFriend = await this.friendRes.createQueryBuilder("f")
                .where("f.followerId = :id OR f.followingId = :id", { id: Number(rId) })
                .getOne();
            if (isHaveRequest || isBeFriend) {
                return response.status(400).send("Already Have Friend Request");
            }
            let newRequest = {
                sender: sender.id,
                recipient: request.params.id
            };
            const rs = await this.friendRequestRes.save(newRequest);
            console.log(rs);
            response.send(rs);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/nonefriend`, auth_middleware_1.default, this.getNoneFriends);
        this.router.get(`${this.path}/search`, auth_middleware_1.default, this.searchFriend);
        this.router.get(`${this.path}/all`, auth_middleware_1.default, this.getFriends);
        this.router.get(`${this.path}/allrequest`, this.allRequest);
        this.router.get(`${this.path}/request`, auth_middleware_1.default, this.getFriendRequest);
        this.router.get(`${this.path}/accept/:id`, auth_middleware_1.default, this.acceptRequest);
        this.router.get(`${this.path}/reject/:id`, auth_middleware_1.default, this.rejectRequest);
        this.router.get(`${this.path}/sendrequest/:id`, auth_middleware_1.default, this.sendFriendRequest);
    }
}
exports.default = FriendController;
//# sourceMappingURL=FriendController.js.map
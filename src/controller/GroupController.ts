import { NextFunction, Response, Router } from "express";
import { NoficationType, sendNofication } from "../entity/NoficationTb";
import { getRepository } from "typeorm";
import { Conversation } from "../entity/Conversation";
import { Group } from "../entity/Group";

import { GroupRequest } from "../entity/GroupRequest";
import { MemberShip } from "../entity/MemberShip";
import { User } from "../entity/User";
import { ConversationType } from "../interfaces/ConversationType";
import { MemberRole } from "../interfaces/MemberRole";
import { RequestStatus } from "../interfaces/RequestStatus";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";

class GroupController{
    public path = '/group';
    public router = Router();
    private conversationRes = getRepository(Conversation)
    private memberShipRes = getRepository(MemberShip)
    private groupRequestRes = getRepository(GroupRequest)
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/reject/:id`, authMiddleware , this.rejectGroup);
        this.router.get(`${this.path}/accept/:id`, authMiddleware , this.acceptGroup);
        this.router.get(`${this.path}/invite/:userid/:conid`, authMiddleware , this.inviteGroup);
        this.router.post(`${this.path}`, authMiddleware , this.createGroup);
        this.router.get(`${this.path}/search`, authMiddleware , this.findGroup);
        this.router.get(`${this.path}/my`, authMiddleware , this.findMyGroup);
    }

    private findMyGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let user = request.user
 
        let rs = await this.conversationRes.createQueryBuilder("c")
        .leftJoinAndSelect("c.group" , "group")
        .leftJoinAndSelect("c.memberships" , "members")
        .where("c.groupId IS NOT NULL")
        .andWhere("members.userId = :id" , {id : user.id})
        .getMany()
        response.send(rs)
    }

    private findGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let user = request.user
 
        let rs = await this.conversationRes.createQueryBuilder("c")
        .leftJoinAndSelect("c.group" , "group")
        .leftJoinAndSelect("c.memberships" , "members")
        .where("c.groupId IS NOT NULL")
        .andWhere("members.userId != :id" , {id : user.id})
        .getMany()
        response.send(rs)
    }

    private rejectGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let id = request.params.id
        let rq = await this.groupRequestRes.findOne({where : {id} , relations : ["sender" , "conversation"]})
        rq.status = RequestStatus.Reject
        const rs = await this.groupRequestRes.save(rq)

        sendNofication(request.user , rq.sender , NoficationType.RejectGroupRequest)

        response.send(rs)
    }

    private acceptGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let id = request.params.id
        let rq = await this.groupRequestRes.findOne({where : {id} , relations : ["sender" , "conversation"]})
        rq.status = RequestStatus.Accept
        await this.groupRequestRes.save(rq)
        
        let mem = new MemberShip()
        mem.user = request.user
        mem.conversation = rq.conversation

        sendNofication(request.user , rq.sender , NoficationType.AcceptGroupRequest)

        let rs = await this.memberShipRes.save(mem)
        response.send(rs)
    }

    private inviteGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let userRes= getRepository(User)
        let targetUser = await userRes.findOne(request.params.userid)
        let con = await this.conversationRes.findOne(request.params.conid)
        let groupRequest : GroupRequest = new GroupRequest()
        groupRequest.conversation = con
        groupRequest.sender = request.user
        groupRequest.recipient = targetUser
        sendNofication(request.user , targetUser , NoficationType.SendGroupRequest)
        const rs = await this.groupRequestRes.save(groupRequest)
        response.send(rs)
    }

    private createGroup = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let group : Group = request.body
        const groupRes = getRepository(Group)
        let g = await groupRes.save(group)
    
        //convesation
        let con = new Conversation()
        let user = request.user
        con.conversationType = ConversationType.Group
        con.group = g
        const rs = await this.conversationRes.save(con)
        //

        //member
        let mem = new MemberShip()
        mem.user= user
        mem.memberRole = MemberRole.Admin
        mem.conversation = rs
        this.memberShipRes.save(mem)
        //

        response.send(con)
     
    }



}

export default GroupController
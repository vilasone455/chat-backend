import { NextFunction, Router , Request , Response } from "express";
import authMiddleware from "../middleware/auth.middleware";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getConnection, getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { getPagination } from "../util/pagination";
import { Conversation } from "../entity/Conversation";
import { User } from "../entity/User";
import { MemberShip } from "../entity/MemberShip";


class ChatController implements Controller {

    public path = '/users';
    public router = Router();
    private chatRes = getRepository(Chat)

    constructor() {
        this.initializeRoutes();
    }
 
    private initializeRoutes() {
        this.router.post(`/privatechat/:id`, authMiddleware , this.privateChat);
        this.router.get(`/allcon`, this.allCon);
        this.router.get(`/conversation`, authMiddleware , this.allConversion);
        this.router.get(`/testcon`, this.testcon);
        this.router.get(`/chats`, this.allChat);
        this.router.get(`/lastmsg`, authMiddleware , this.getLastMessage);
        this.router.get(`/messages/:id`, authMiddleware ,this.getChatLog);
        this.router.post(`/messages`, authMiddleware , this.addMessage);
    }

    private testcon = async (request: RequestWithUser, response: Response, next: NextFunction) => {
       
        const memres = getRepository(MemberShip)
       
        let rs =await memres.find({relations : ["conversation" , "user"]})
     
        response.send(rs)
    }

    private getLastMessage = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        let pag = getPagination(request , 15)
        let user = request.user
        
        const rs = await getConnection().createQueryBuilder(Chat , "c")
        .leftJoin("c.sender" , "sender")
        .leftJoinAndSelect("c.conversation" , "con")
        .leftJoin("con.memberships" , "memberships")
        .where("c.senderId = :uId OR memberships.userId = :uId" , {uId : user.id })
        .select('MAX(c.id)', 'cid')

        .addSelect('MAX(c.msg)', 'msg')
        .addSelect('c.conversationId', 'd')
        .groupBy("c.conversationId")
        .skip(pag.skip)
        .take(pag.take)
        .getRawMany()

  
        console.log(rs)
        let msgId : number[] = []

        rs.forEach(r=>{
            msgId.push(Number(r.cid))
        })

        const msgs = await this.chatRes.createQueryBuilder("c")
        .innerJoinAndSelect("c.conversation" , "conversation")
        .innerJoinAndSelect("c.sender" , "sender")
        .leftJoinAndSelect("conversation.memberships" , "memberships")
        .innerJoinAndSelect("memberships.user" , "user")
        .where("c.id IN (:...chatList)" , { chatList: msgId } )
        .getMany()
        

        response.send({val : msgs , user})
    }

    private getChatLog = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        let pag = getPagination(request , 15)
        let user = request.user
        let id = request.params.id
        //console.log(request.params.orderid)
        //console.log(user)
        const rs = await this.chatRes.createQueryBuilder("c")
        .leftJoinAndSelect("c.sender" , "sender")
        .leftJoin("c.conversation" , "con")
        .leftJoin("con.memberships" , "memberships")
        .where("(c.senderId = :uId OR memberships.userId = :uId) AND c.conversationId = :cId" , {uId : user.id , cId : id })
        .orderBy("c.id", "DESC")
        .skip(pag.skip)
        .take(pag.take)
        .getMany()
        response.send(rs)
    }

    private addMessage = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let add : Chat = request.body
        add.sender = request.user
        const chats = await this.chatRes.save(add)
        response.send(chats)
    }

    private allCon = async (request: Request, response: Response, next: NextFunction) => {
        const converRes = getRepository(Conversation)
        const chats = await converRes.createQueryBuilder("c")
        .leftJoinAndSelect("c.group" , "group")
        .leftJoinAndSelect("c.members" , "members")
        .getMany()
        response.send(chats)
    }

    private allConversion = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const converRes = getRepository(Conversation)
        const chats = await converRes.createQueryBuilder("c")
        .leftJoinAndSelect("c.members" , "members")
        .where("members.userId = :uId" , {uId : Number(request.user.id)})
        .getMany()
        response.send(chats)
    }

    private allChat = async (request: Request, response: Response, next: NextFunction) => {
        const chats = await this.chatRes.find();
        response.send(chats)
    }

    private privateChat = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userRes = getRepository(User)
        const memRes = getRepository(MemberShip)
        let targetId = request.params.id
        let target = await userRes.findOne(targetId)
        let user = request.user
        const conversationRes = getRepository(Conversation)

        let conver : Conversation = new Conversation()
        conver.title = ""
        
        const rs = await conversationRes.save(conver)
        let member1 = new MemberShip()
        member1.user = user
        member1.conversation = rs
        let member2 = new MemberShip()
        member2.user = target
        member2.conversation = rs

        await memRes.save([member1 , member2])

        response.send(rs)
    }

}

export default ChatController
import { NextFunction, Response, Router } from "express";
import { NoficationType, sendNofication } from "../entity/NoficationTb";
import { RequestStatus } from "../interfaces/RequestStatus";
import { getConnection, getRepository, Like } from "typeorm";
import { Friend } from "../entity/Friend";
import { FriendRequest } from "../entity/FrientRequest";
import { User } from "../entity/User";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";

class FriendController{
    public path = '/friend';
    public router = Router();
    private friendRequestRes = getRepository(FriendRequest)
    private friendRes = getRepository(Friend)
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/nonefriend`, authMiddleware , this.getNoneFriends);
        this.router.get(`${this.path}/search`, authMiddleware , this.searchFriend);
        this.router.get(`${this.path}/all`, authMiddleware , this.getFriends);
        this.router.get(`${this.path}/allrequest` , this.allRequest);
        this.router.get(`${this.path}/request`, authMiddleware , this.getFriendRequest);
        this.router.get(`${this.path}/accept/:id`, authMiddleware , this.acceptRequest);
        this.router.get(`${this.path}/reject/:id`, authMiddleware , this.rejectRequest);
        this.router.get(`${this.path}/sendrequest/:id`, authMiddleware , this.sendFriendRequest);
    }

    private allRequest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const rs = await this.friendRequestRes.createQueryBuilder("f")
        .innerJoinAndSelect("f.sender" , "sender")
        .innerJoinAndSelect("f.recipient" , "recipient")

        .getMany()
        console.log(rs)
        response.send(rs)
     
     
    }

    private searchFriend = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userRes = getRepository(User)
        let search = request.query["search"]
        const rs = await userRes.find({
            where : {firstName : Like(search)}
        })
        response.send(rs)
     
    }

    private getNoneFriends = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userRes = getRepository(User)
        let user = request.user
       console.log(user)
        let fQuery = getConnection()
        .createQueryBuilder(Friend , "f")
        .innerJoinAndSelect("f.follower" , "follower")
        .innerJoinAndSelect("f.following" , "following")

        .where(`(f.followerId = u.id AND f.followingId = ${user.id})` )
        .orWhere(`(f.followingId = u.id AND f.followerId = ${user.id})`)
        .getQuery() 

        let rQuery = getConnection()
        .createQueryBuilder(FriendRequest , "fs")
        .innerJoinAndSelect("fs.sender" , "sender")
        .innerJoinAndSelect("fs.recipient" , "recipient")

        .where(`(fs.senderId = u.id AND fs.recipientId = ${user.id})` )
        .orWhere(`(fs.recipientId = u.id AND fs.senderId = ${user.id})`)
        .getQuery() 
        
        
        const rs = await userRes.createQueryBuilder("u")
        .where(`NOT EXISTS (${fQuery})`)
        .andWhere(`NOT EXISTS (${rQuery})`)
        .orderBy("u.id" , "DESC")
        .getMany()
        response.send(rs)
     
    }

    private getFriends = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        let user = request.user
        const rs = await this.friendRes.createQueryBuilder("f")
        .innerJoinAndSelect("f.follower" , "follower")
        .innerJoinAndSelect("f.following" , "following")
        .where("f.followerId = :id OR f.followingId = :id" , { id : user.id }).getMany()


        let friends : User[] = []
        rs.forEach(f => {
            if(f.follower.id === user.id){
                friends.push(f.following)
            }
            if(f.following.id === user.id){
                friends.push(f.follower)
            }
        });

        response.send(friends)
     
    }

    private rejectRequest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let id = request.params.id
        let user = request.user
        const rs = await this.friendRequestRes.createQueryBuilder("f")
        .innerJoinAndSelect("f.recipient" , "recipient")
        .innerJoinAndSelect("f.sender" , "sender")
        .where("f.id = :id" , { id }).getOne()
        if(rs){
            if(rs.recipient.id === user.id){
                rs.status = RequestStatus.Reject
                sendNofication(user , rs.sender , NoficationType.RejectFriendRequest)
                const fs = await this.friendRequestRes.save(rs)
                return response.send(fs)
            }else{
                return response.status(400).send("Bad Request")
            }
        }else{
            response.status(404).send("Request Not found")
        }
     
    }

    private acceptRequest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let id = request.params.id
        let user = request.user
        const friendRes = getRepository(Friend)
        const rs = await this.friendRequestRes.createQueryBuilder("f")
        .innerJoinAndSelect("f.recipient" , "recipient")
        .innerJoinAndSelect("f.sender" , "sender")
        .where("f.id = :id" , { id }).getOne()
        if(rs){
            if(rs.recipient.id === user.id){
                let f = new Friend()
                f.follower = user // main
                f.following = rs.sender // other
                rs.status = 2
                sendNofication(user , rs.sender , NoficationType.AcceptFriendRequest)
                await this.friendRequestRes.save(rs)
                const fs = await friendRes.save(f)
                return response.send(fs)
            }else{
                return response.status(400).send("Bad Request")
            }
        }else{
            response.status(404).send("Request not found")
        }
        response.send(rs)
    }

    private getFriendRequest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let user = request.user
        console.log(user)
        const rs = await this.friendRequestRes.createQueryBuilder("f")
        .innerJoinAndSelect("f.sender" , "sender")
        .innerJoinAndSelect("f.recipient" , "recipient")
        .where("f.senderId = :uId OR f.recipientId = :uId" , { uId: Number(user.id) })
        .getMany()
        console.log(rs)
        response.send(rs)
    }


    private sendFriendRequest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        //cant send multi
        let userRes = getRepository(User)
        let sender = request.user
        console.log(sender)
        console.log("send request")
        let rId = request.params.id
        if(sender.id == Number(request.params.id)) return response.status(400).send("Cant Request Self")
        let isHaveRequest = await this.friendRequestRes.createQueryBuilder("fs")
        .where("fs.senderId = :id OR fs.recipientId = :id" , {id : Number(rId)}).getOne()

        let isBeFriend = await this.friendRes.createQueryBuilder("f")
        .where("f.followerId = :id OR f.followingId = :id" ,  {id : Number(rId)})
        .getOne()

        if(isHaveRequest || isBeFriend) {
            return response.status(400).send("Already Have Friend Request")
        }


        let newRequest : any = {
            sender : sender.id,
            recipient : request.params.id
        }
        let target = await userRes.findOne(request.params.id)
        if(!target) return response.status(400).send("User not Exist")

        sendNofication(sender , target , NoficationType.SendFriendRequest)
        const rs = await this.friendRequestRes.save(newRequest)
        console.log(rs)
        response.send(rs)
    }


}

export default FriendController
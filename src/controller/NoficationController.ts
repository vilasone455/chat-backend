import { NextFunction, Router, Request, Response } from "express";
import authMiddleware from "../middleware/auth.middleware";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getRepository } from "typeorm";

import { NoficationTb } from "../entity/NoficationTb";

class NoficationController implements Controller {

    public path = '/nofication';
    public router = Router();
    private nofiRes = getRepository(NoficationTb)

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware , this.allNofication);
    }


    private allNofication = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let user = request.user
        const rs = await this.nofiRes.createQueryBuilder("n")
        .innerJoinAndSelect("n.sender" , "sender")
        .innerJoinAndSelect("n.recipient" , "recipient")
        .where("n.senderId = :id OR n.recipientId = :id" , {id : user.id})
        .getMany()
        response.send(rs)
    }

}

export default NoficationController
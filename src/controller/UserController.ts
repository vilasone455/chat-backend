import { NextFunction, Router, Request, Response } from "express";
import authMiddleware from "../middleware/auth.middleware";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import TokenData from "../interfaces/tokenData.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import * as jwt from 'jsonwebtoken';

class UserController implements Controller {

    public path = '/users';
    public router = Router();
    private userRes = getRepository(User)

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/alluser`, this.allUsers);
        this.router.put(`/edituser/:id`, this.editUser);
        this.router.post(`/login`, this.login);
        this.router.post(`/register`, this.register);
    }

    private editUser = async (request: Request, response: Response, next: NextFunction) => {
        let u : User = request.body
        const rs = await this.userRes.save(u)
        response.send(rs)
    }


    private login = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const logInData: any = request.body;
    
        const user = await this.userRes.findOne({ where: { userEmail: logInData.userEmail }})
 
        if (user) {
            console.log("have user")
            const isPasswordMatching = await bcrypt.compare(logInData.userPassword, user.userPassword)
            console.log(isPasswordMatching)
            if (isPasswordMatching) {
                const tokenData = this.createToken(user);
                response.send({ ...user, tokenData });
       

            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }

    }


    private register = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        let userData: User = request.body
        try {
            if (await this.userRes.findOne({ userEmail: userData.userEmail })
            ) {
                throw new UserWithThatEmailAlreadyExistsException(userData.userEmail);
            }

            const hashedPassword = await bcrypt.hash(userData.userPassword, 10);
            userData.userPassword = hashedPassword
            const rs = await this.userRes.save(userData)
            response.send(rs)
        } catch (error) {

        }

    }

    private allUsers = async (request: Request, response: Response, next: NextFunction) => {

        const rs = await this.userRes.find()
        response.send(rs)
    }

    private createToken(user: User): TokenData {
        const expiresIn = "7d"; // an hour
        const secret = process.env.SECRET_KEY;
        const dataStoredInToken: DataStoredInToken = {
          _id: user.id,
        };
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
      }



}

export default UserController
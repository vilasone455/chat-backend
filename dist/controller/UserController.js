"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const UserWithThatEmailAlreadyExistsException_1 = require("../exceptions/UserWithThatEmailAlreadyExistsException");
const bcrypt = require("bcrypt");
const WrongCredentialsException_1 = require("../exceptions/WrongCredentialsException");
const jwt = require("jsonwebtoken");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.userRes = typeorm_1.getRepository(User_1.User);
        this.editUser = async (request, response, next) => {
            let u = request.body;
            const rs = await this.userRes.save(u);
            response.send(rs);
        };
        this.login = async (request, response, next) => {
            const logInData = request.body;
            const user = await this.userRes.findOne({ where: { userEmail: logInData.userEmail } });
            if (user) {
                console.log("have user");
                const isPasswordMatching = await bcrypt.compare(logInData.userPassword, user.userPassword);
                console.log(isPasswordMatching);
                if (isPasswordMatching) {
                    const tokenData = this.createToken(user);
                    response.send(Object.assign({}, user, { tokenData }));
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        };
        this.register = async (request, response, next) => {
            let userData = request.body;
            try {
                if (await this.userRes.findOne({ userEmail: userData.userEmail })) {
                    throw new UserWithThatEmailAlreadyExistsException_1.default(userData.userEmail);
                }
                const hashedPassword = await bcrypt.hash(userData.userPassword, 10);
                userData.userPassword = hashedPassword;
                const rs = await this.userRes.save(userData);
                response.send(rs);
            }
            catch (error) {
            }
        };
        this.allUsers = async (request, response, next) => {
            const rs = await this.userRes.find();
            response.send(rs);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`/alluser`, this.allUsers);
        this.router.put(`/edituser/:id`, this.editUser);
        this.router.post(`/login`, this.login);
        this.router.post(`/register`, this.register);
    }
    createToken(user) {
        const expiresIn = "7d";
        const secret = process.env.SECRET_KEY;
        const dataStoredInToken = {
            _id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map
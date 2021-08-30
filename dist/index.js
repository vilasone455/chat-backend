"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
require("reflect-metadata");
require("./initenv");
const typeorm_1 = require("typeorm");
const ChatController_1 = require("./controller/ChatController");
const UserController_1 = require("./controller/UserController");
const FriendController_1 = require("./controller/FriendController");
const GroupController_1 = require("./controller/GroupController");
const NoficationController_1 = require("./controller/NoficationController");
const Redis = require("ioredis");
typeorm_1.createConnection().then(async (connection) => {
    let url = process.env.REDIS_ENDPOINT_URI;
    const redis = new Redis(url);
    console.log(url);
    redis.get("foo", function (err, result) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(result);
        }
    });
    console.log("app running");
    const app = express();
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "x-requested-with, content-type , authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    let controllers = [
        new UserController_1.default,
        new ChatController_1.default(),
        new FriendController_1.default(),
        new GroupController_1.default(),
        new NoficationController_1.default()
    ];
    controllers.forEach((controller) => {
        app.use('/', controller.router);
    });
    const httpServer = require("http").createServer(app);
    console.log("port : " + process.env.PORT || 3000);
    httpServer.listen(process.env.PORT || 3000, () => {
    });
    app.on('close', () => {
        app.removeAllListeners();
    });
}).catch(error => console.log(error));
//# sourceMappingURL=index.js.map
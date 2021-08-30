import bodyParser = require("body-parser");
import express = require("express");
import "reflect-metadata";
import './initenv'
import {createConnection} from "typeorm";
import ChatController from "./controller/ChatController";

import Controller from "./interfaces/controller.interface";
import UserController from "./controller/UserController";
import FriendController from "./controller/FriendController";
import GroupController from "./controller/GroupController";
import NoficationController from "./controller/NoficationController";
const Redis = require("ioredis");   

createConnection().then(async connection => {
    let url = process.env.REDIS_ENDPOINT_URI
    const redis = new Redis(url);
    console.log(url)
    let top = process.env.MYTOP
    redis.set("foo" , top)

    redis.get("foo", function (err, result) {
        if (err) {
          console.error(err);
        } else {
          console.log(result); // Promise resolves to "bar"
        }
      });

    console.log("app running")
    const app = express();

    app.use(function( req, res, next ) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "x-requested-with, content-type , authorization" );
        res.header("Access-Control-Allow-Credentials", "true");
        if ('OPTIONS' == req.method) { res.send(200); } else { next(); } 
    });



    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    let controllers : Controller[] = [
        new UserController,
        new ChatController(),
        new FriendController(),
        new GroupController(),
        new NoficationController()
    ]
    
    controllers.forEach((controller) => {
        app.use('/', controller.router);
    });

    const httpServer = require("http").createServer(app);
    console.log("port : " +process.env.PORT || 3000 )
    httpServer.listen(process.env.PORT || 3000  , () => {
        //BanJob.checkBanUser()
    });
  
    app.on('close', () => {
        app.removeAllListeners();
    });

}).catch(error => console.log(error));

import bodyParser = require("body-parser");
import express = require("express");
import "reflect-metadata";
import './initenv'
import {createConnection, Server} from "typeorm";
import ChatController from "./controller/ChatController";

import Controller from "./interfaces/controller.interface";
import UserController from "./controller/UserController";
import FriendController from "./controller/FriendController";
import GroupController from "./controller/GroupController";
import NoficationController from "./controller/NoficationController";
import { createAdapter } from '@socket.io/redis-adapter';
import * as Redis from 'ioredis'

import * as jwt from 'jsonwebtoken';

createConnection().then(async connection => {
    let url = process.env.REDIS_ENDPOINT_URI
    const pubClient  = new Redis(url);
    console.log(url)

  
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
    const options = { cors: {
        origin: "*",
      }, };


    const io  = require("socket.io")(httpServer, options);
  
    const subClient = pubClient.duplicate();

    io.adapter(createAdapter(pubClient, subClient));
   

    io.use((socket, next) => {
        console.log("start connect")
        const token = socket.handshake.auth.token
        console.log("get connection auth : " + token)
        if (token){
          const secret = process.env.SECRET_KEY;
          jwt.verify(token, secret , function(err, decoded : any) {
            if (err) return next(new Error('Authentication error'));
            console.log("new user : " + decoded._id)
            socket["user_id"]  =  decoded._id;;
            next();
          });
        }
        else {
          next(new Error('Authentication error'));
        }    
      });
  

    io.on('connection', async (socket) => {
        console.log("connect user :" + socket["user_id"])
        let user : any = {
          socketId : socket.id,
          userId : socket["user_id"]
        }

        pubClient.ltrim("online_user" , 99 , 0)


        let onlineUserStr = await pubClient.lrange("online_user",0 , -1)
        let onlineUsers = onlineUserStr.map(o=>JSON.parse(o))
       
        let indexof = onlineUsers.findIndex(o=>o.userId == socket["user_id"])
        if(indexof !== -1){
          console.log("update at " + indexof)
          pubClient.lset("online_user" , indexof , JSON.stringify(user))
        }else{
          console.log("add new session user")
          pubClient.lpush("online_user" , JSON.stringify(user))
        }

        socket.to(socket.id).emit("online_user" , onlineUsers);

        let strsss = await pubClient.lrange("online_user", 0 , -1)
        let allUsers = strsss.map(o=>JSON.parse(o))
        console.log(allUsers)

        socket.on('message', function(chat) {
          socket.to("room" + chat.conversation).emit("message" , chat)
        }); 

        socket.on('join', function({id}) {
          console.log("Join room " + id)
          socket.join("room"+id);
        }); 

        socket.on('disconnect', async function (data) {
          console.log("dis connect "+socket["user_id"])
          let onlineUserStr = await pubClient.lrange("online_user",0 , -1)
          let onlineUsers = onlineUserStr.map(o=>JSON.parse(o)) 
          console.log(onlineUsers)
          let indexof = onlineUsers.findIndex(o=>o.userId == socket["user_id"])
          let user : any = {
            socketId : socket.id,
            userId : socket["user_id"]
          }
          if(indexof !== -1){

            pubClient.lrem("online_user" , 1 , JSON.stringify(user))
            let strst = await pubClient.lrange("online_user",0 , -1)
            console.log("after remove")
            let allu = strst.map(o=>JSON.parse(o)) 
            console.log(allu)
          }

        });
    });

    console.log("port : " +process.env.PORT || 3000 )
    httpServer.listen(process.env.PORT || 3000  , () => {
        //BanJob.checkBanUser()
    });
  
    app.on('close', () => {
        app.removeAllListeners();
    });

}).catch(error => console.log(error));

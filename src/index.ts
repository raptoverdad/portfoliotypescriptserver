import  { Request, Response } from 'express';
import {Bot} from './bot'
import {CONFIG} from './config'
//import {Bot} from './bot'
const cors=require("cors")
const http = require('http');
const express = require("express");
const app =  express();
const server = http.createServer(app);

let bot:Bot;

  const io = require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        allowedHeaders:["Access-Control-Allow-Origin"],
        credentials:false
    }
});
const key=CONFIG.SOCKET_KEY
io.use(async(socket:any,next:any)=>{
    let frontendKey=await socket.handshake.query.key
    if(frontendKey !== key){
        next(new Error("invalid key"))
    }else{
        next()
    }
    })
io.on('connection',async (socket:any)=>{
    socket.on('message',async (message:string)=>{
        try {
            let bossMessage=await bot.sendMessage(message)
        } catch (error) {
            console.log('chatVisitor error:',error)
        }
    })
}) 
app.listen(3000,async ()=>{
    console.log("app listening on port 3000")
    bot = await Bot.getInstance();
    console.log("bot is listening")
})
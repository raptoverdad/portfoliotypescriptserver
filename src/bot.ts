import { Telegraf, Context } from 'telegraf';
const http = require('http');
import {CONFIG} from './config'
import { Server, Socket } from 'socket.io';

export class Bot {
  private bot: Telegraf<Context>;
  private static instance: Bot;
  private io: Server;
  private key: string;
  private chatId: string;
  private userSocket: string | null;

  constructor() {
    this.bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
    this.key = CONFIG.SOCKET_KEY;
    this.chatId = "5893927006";
    this.userSocket = null;
    this.iniciar();

    this.io = new Server(
      http.createServer().listen(3000),
      {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: false,
        },
      }
    );

    this.io.use(async (sockete:any, next:any) => {
      let frontendKey = await sockete.handshake.query.key;
      if (frontendKey !== this.key) {
        throw new Error("invalid socket connection")
      } else {
        next();
      }
    });

    this.io.on("connection", (socket:any) => {
      console.log("Cliente conectado");

      socket.on("isAvailableOrNot",(data:string)=>{
        if(this.userSocket==null){
          this.io.to(data).emit("isAvailableOrNotResponse","yes");
        }else{
          this.io.to(data).emit("isAvailableOrNotResponse","no");
        }
      });
      //socket que vuelve la variable userSocket en null denuevo
      socket.on("socketoff",(id:any)=>{
        console.log("el socket con id ",id," se fue")
         if(id==this.userSocket){
          this.userSocket=null
         }
      })

      try {
        socket.on("message", async (json: any, senderSocket:any) => {           
            let pakete=JSON.parse(json);
            let id=pakete.id
            let message=pakete.message
            if(this.userSocket==null){
              this.userSocket = id;
              this.io.to(id).emit("joined");
              let bossMessage = await this.bot.telegram.sendMessage(this.chatId,"id: "+id+" mensaje: "+message);
            }else if(id==this.userSocket){   
              let bossMessage = await this.bot.telegram.sendMessage(this.chatId,"id: "+id+" mensaje: "+message)    
            }else if(this.userSocket!=null){
              this.io.to(id).emit("isAvailableOrNotResponse", "no");
            }
            
          
              });
      }catch(error){
        console.log("chatVisitor error:", error);
      }

    });
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  private async iniciar(): Promise<void> {
    console.log("Bot listening");

    this.bot.hears(/^(?!.*(?:leavechat|chatinfo)).+$/, async (ctx:any) => {
      try {
        let message = ctx.message.text;
        if (this.userSocket) {
          this.io.to(this.userSocket).emit("bossMessage", message);
        }else if(this.userSocket==null){
          let nullMessage = await this.bot.telegram.sendMessage(
            this.chatId,
            "SERVER: SOCKET IS NULL TYPE"
          );
        }
      } catch (error) {
        console.log(error);
        let errorMessage = await this.bot.telegram.sendMessage(
          this.chatId,
          "SERVER: THE SOCKET YOU ARE TRYING TO TALK TO DOESN'T EXIST"
        );
      }
    });

    this.bot.hears("leavechat",async()=>{
      if(this.userSocket){
        await this.io.to(this.userSocket).emit("bossOut"); 
        this.userSocket=null
        await this.io.sockets.emit("isAvailableOrNotResponse", "yes")
      }else if(this.userSocket == null){
        let leaveChatMessage = await this.bot.telegram.sendMessage(
          this.chatId,
          "SERVER: NO SOCKET IS CONNECTED"
        );
      }
     
    })
    this.bot.hears("chatinfo",async()=>{
      if(this.userSocket != null){
        let infoMessage = await this.bot.telegram.sendMessage(
          this.chatId,
          "SERVER: THE SOCKET IS "+this.userSocket
        );
      }else if(this.userSocket == null){
        let infoMessage = await this.bot.telegram.sendMessage(
          this.chatId,
          "SERVER: THE SOCKET IS NULL"
        );
      }

    })

    await this.bot.launch();
  }

  detener(): void {
    this.bot.stop();
  }
}
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
          allowedHeaders: ["Access-Control-Allow-Origin"],
          credentials: false,
        },
      }
    );

    this.io.use(async (sockete:any, next:any) => {
      let frontendKey = await sockete.handshake.query.key;
      if (frontendKey !== this.key) {
        next(new Error("invalid key"));
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
         if(id==this.userSocket){
          this.userSocket=null
         }
      })

      try {
        socket.on("message", async (json: any, senderSocket:any) => {

            let pakete=JSON.parse(json);
            if(this.userSocket==null){
              this.userSocket = pakete.id;
              let bossMessage = await this.bot.telegram.sendMessage(
                this.chatId,
                pakete.message
              );
              this.io.sockets.emit("isAvailableOrNotResponse", "no")
            }else{
              this.io.to(pakete.id).emit("isAvailableOrNotResponse", "no");
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

    this.bot.hears(/.*/, async (ctx:any) => {
      try {
        let message = ctx.message.text;
        if (this.userSocket) {
          this.io.to(this.userSocket).emit("bossMessage", message);
        }
      } catch (error) {
        console.log(error);
      }
    });

    await this.bot.launch();
  }

  detener(): void {
    this.bot.stop();
  }
}
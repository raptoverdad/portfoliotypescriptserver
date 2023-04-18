import { Server } from 'socket.io';
import { Telegraf, Context } from 'telegraf';
const http = require('http');
import {CONFIG} from './config'

export class Bot {
  private bot: Telegraf<Context>;
  private static instance: Bot;
  private io: Server;
  private key:String;
  private chatId:string
  constructor() {
    this.bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
    this.key=CONFIG.SOCKET_KEY
    this.chatId="5893927006"
    this.iniciar();
    this.io = new Server(http.createServer().listen(3000),{
      cors:{
          origin:"*",
          methods:["GET","POST"],
          allowedHeaders:["Access-Control-Allow-Origin"],
          credentials:false
      }
  }); // Creamos un servidor de Socket.IO en el puerto 3000
    this.io.use(async (sockete, next) => {
      let frontendKey =await  sockete.handshake.query.key;
      if (frontendKey !== this.key) {
        next(new Error('invalid key'));
      } else {
        next();
      }
    });
    //inicio socket
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');
      socket.on('message',async (message:string)=>{
        try {
            let bossMessage=await this.bot.telegram.sendMessage(this.chatId,message)
        } catch (error) {
            console.log('chatVisitor error:',error)
        }
    })

    });
    //fin sockets
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  private async iniciar(): Promise<void> {

    console.log('Bot listening');
        // Función que escucha los mensajes de la gente
    this.bot.hears(/.*/, async (ctx) => {
      try {
        // Aquí iría el código para procesar los mensajes recibidos por el bot
        // ...
        
        // Enviamos el mensaje a través de Socket.IO
        //this.io.emit('message', { chatId: chatId, message: message });
        
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
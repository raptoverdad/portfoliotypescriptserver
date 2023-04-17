import { Telegraf, Context } from 'telegraf';
import {CONFIG} from './config'

export class Bot 
{
  private bot: Telegraf<Context>;
 
  private static instance: Bot;


  constructor() {
    this.bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
    this.iniciar()
  }
  
  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

 private async iniciar(): Promise<void> {
      //funcion que escucha los mensajes de la gente
      this.bot.hears(/^(?!.*\bstop\b).*$/i,async (ctx) => {  
      try {
        let chatId = ctx.chat?.id.toString();
      } catch (error) {
        console.log(error)
      }


      });
      this.bot.hears("Stop", (ctx) => {
        ctx.reply('encontraste tu telefono 👍');
      });
    await this.bot.launch();

  }

  detener(): void {
    this.bot.stop();
  }


} 
   
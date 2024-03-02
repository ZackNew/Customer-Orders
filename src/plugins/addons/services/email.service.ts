import {
    Injectable,
  } from '@nestjs/common';
import nodemailer from "nodemailer";
@Injectable()
export class EmailService{
    emailTransportCacheToken:string='email-transport';
    transporter:any;

    async loadAndCacheSMTPTransport(){
        this.transporter = this.createTransport();
    }

    createTransport(){
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            debug: false,
            logger: true 
       });
    }

    async sendMail(to:string,subject:string,html:string){
        await this.loadAndCacheSMTPTransport();
        let info = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
          });
    }
}
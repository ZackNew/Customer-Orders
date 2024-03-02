import { Injectable } from '@nestjs/common';
import {
    Administrator,
    Order,
    OrderStateTransitionEvent,
    ProductVariantService,
    TransactionalConnection,
} from '@vendure/core';
import { EmailService } from './email.service';
import axios from 'axios';


@Injectable()
export class AddonService {
    constructor(
        private connection: TransactionalConnection,
        private emailService:EmailService
    ) {}


   async sendEmailForAdmin(event: OrderStateTransitionEvent){
    const orderRepo= this.connection.getRepository(event.ctx, Order);
    const adminRepo= this.connection.getRepository(event.ctx, Administrator);
    const currentAdmin= await adminRepo.findOne({where:{user:{id: event.ctx.activeUserId}},});
    const order= await orderRepo.findOneBy({code:event.order.code});
    const adminPhone=currentAdmin.customFields;

     // send sms
     const accountSid = 'AC2e223ec59a87385f5237f2e7f2bee67c';
     const authToken = '7f70f55ba7370acc9189b011315c7d4d';

     try {
         const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/AC2e223ec59a87385f5237f2e7f2bee67c/Messages.json',
        new URLSearchParams({
          To:adminPhone["phonenumber"],
          From: '+13346001928',
          Body: `New order with order code ${order.code} is placed `,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          },
        }
      );
      if(response){
        console.log(response.data);        
      }
        
     } catch (error) {
        console.log(error);
     }
    
    }





}
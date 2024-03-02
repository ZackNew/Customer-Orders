import { Administrator, EventBus, LanguageCode, OrderStateTransitionEvent, PluginCommonModule, TransactionalConnection, VendurePlugin } from '@vendure/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import { AddonService } from './services/addons.service';
import { EmailService } from './services/email.service';

@VendurePlugin({
    compatibility: "^2.0.0",
    imports: [PluginCommonModule],
    providers:[AddonService,EmailService],
    configuration:config => {
        config.customFields.Administrator.push({
            type: 'string',
            name: 'phonenumber',
            label: [{ languageCode: LanguageCode.en, value: 'PhoneNumber' }],
            nullable:true,
        });
        return config;
    },
})
export class AddonPlugin implements OnApplicationBootstrap {
    constructor(
        private eventBus: EventBus,
        private emailService: EmailService,
        private addonService:AddonService
    ) {}
    async onApplicationBootstrap() {

        this.eventBus
          .ofType(OrderStateTransitionEvent)
          .subscribe(async (event) => {
            // do some action when this event fires
            if(event.toState=="AddingItems"){
                // send email to admin
                this.addonService.sendEmailForAdmin(event);
            }
            
          });
      }
}
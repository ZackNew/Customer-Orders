import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  InjectableStrategy,
  RequestContext,
  StockLevel,
  ID,
  AvailableStock,
  StockLocation,
  OrderLine,
  LocationWithQuantity,
  ProductVariant,
  StockDisplayStrategy,
  OrderStateTransitionEvent,
} from "@vendure/core";
import { defaultEmailHandlers, EmailEventListener, EmailPlugin, hydrateShippingLines, transformOrderLineAssetUrls } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import "dotenv/config";
import path from "path";
import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import { OrderPicklistPlugin } from "./plugins/order-picklist";
import { AddonPlugin } from "./plugins/addons/addons.plugin";

const IS_DEV = process.env.APP_ENV === "dev";

export class ExactStockDisplayStrategy implements StockDisplayStrategy {
    getStockLevel(ctx: RequestContext, productVariant: ProductVariant, saleableStockLevel: number): string {
        return saleableStockLevel.toString();
    }
}

// export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
//     .on(OrderStateTransitionEvent)
//     // Only send the email when the Order is transitioning to the
//     // "PaymentSettled" state and the Order has a customer associated with it.
//     .filter(
//         event =>
//             event.toState === 'PaymentSettled'
//             && !!event.order.customer,
//     )

//     .loadData(async ({ event, injector }) => {
//         transformOrderLineAssetUrls(event.ctx, event.order, injector);
//         const shippingLines = await hydrateShippingLines(event.ctx, event.order, injector);
//         return { shippingLines };
//     })
//     // Here we are setting the recipient of the email to be the
//     // customer's email address.
//     .setRecipient(event => event.order.customer!.emailAddress)
//     .setFrom('{{ fromAddress }}')
//     .setSubject('Order confirmation for #{{ order.code }}')
//     // The object returned here defines the variables which are
//     // available to the email template.
//     .setTemplateVars(event => ({ order: event.order, shippingLines: event.data.shippingLines }))
export const config: VendureConfig = {
  catalogOptions: {
    stockDisplayStrategy: new ExactStockDisplayStrategy(),
},
  apiOptions: {
    port: 3000,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { "request.credentials": "include" } as any,
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { "request.credentials": "include" } as any,
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    type: "mariadb",
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: false,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    // PicklistPlugin,
    OrderPicklistPlugin,
    AddonPlugin,
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : "https://www.my-shop.com/assets",
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    // EmailPlugin.init({
    //   devMode: true,
    //   outputPath: path.join(__dirname, "../static/email/test-emails"),
    //   route: "mailbox",
    //   handlers: defaultEmailHandlers,
    //   templatePath: path.join(__dirname, "../static/email/templates"),
    //   globalTemplateVars: {
    //     // The following variables will change depending on your storefront implementation.
    //     // Here we are assuming a storefront running at http://localhost:8080.
    //     // fromAddress: '"example" <noreply@example.com>',
    //     // verifyEmailAddressUrl: "http://localhost:8080/verify",
    //     // passwordResetUrl: "http://localhost:8080/password-reset",
    //     // changeEmailAddressUrl:
    //     //   "http://localhost:8080/verify-email-address-change",
    //   },
    // }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
      // app: compileUiExtensions({
      //   outputPath: path.join(__dirname, "../admin-ui"),
      //   extensions: [OrderPicklistPlugin.ui],
      //  //  PicklistPlugin.ui
      // }),
      app: {
        path: path.join(__dirname, "../../admin-ui/dist"),
      },
      // app: {
      //   path:"/home/aman/Documents/upwork/Customer-Orders/dist/admin-ui",
      // },
    }),
  ],
};

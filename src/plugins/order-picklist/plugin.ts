import {
  PluginCommonModule,
  RuntimeVendureConfig,
  VendurePlugin,
} from "@vendure/core";
import { AdminUiExtension } from "@vendure/ui-devkit/compiler";
import path from "path";
import { InvoiceConfigEntity } from "./api/invoice-config.entity";
import { PicklistService } from "./api/picklist.service";
import { PicklistResolver, picklistPermission } from "./api/picklist.resolver";
import { schema } from "./api/schema.graphql";
import { PicklistController } from "./api/picklist.controller";
import {
  RedisSessionCachePluginOptions,
  RedisSessionCacheStrategy,
} from "./api/strategies/redis-session-cache.strategy";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [InvoiceConfigEntity],
  providers: [PicklistService],
  controllers: [PicklistController],
  adminApiExtensions: {
    schema: schema as any,
    resolvers: [PicklistResolver],
  },
  configuration: (config: RuntimeVendureConfig) => {
    config.authOptions.customPermissions.push(picklistPermission);
    config.authOptions.sessionCacheStrategy = new RedisSessionCacheStrategy(
      OrderPicklistPlugin.options
    );
    return config;
  },
})
export class OrderPicklistPlugin {
  static options: RedisSessionCachePluginOptions;
  static init(options: RedisSessionCachePluginOptions) {
    this.options = options;
    return this;
  }
  static ui: AdminUiExtension = {
    extensionPath: path.join(__dirname, "ui"),
    ngModules: [
      {
        type: "lazy",
        route: "picklists",
        ngModuleFileName: "picklist.module.ts",
        ngModuleName: "PicklistModule",
      },
      {
        type: "shared",
        ngModuleFileName: "picklist.nav.module.ts",
        ngModuleName: "PicklistNavModule",
      },
    ],
  };
}

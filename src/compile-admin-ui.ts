import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { OrderPicklistPlugin } from "./plugins/order-picklist";

compileUiExtensions({
  outputPath: path.join(__dirname, "../admin-ui"),
  extensions: [OrderPicklistPlugin.ui],
})
  .compile?.()
  .then(() => {
    process.exit(0);
  });

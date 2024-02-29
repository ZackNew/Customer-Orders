import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { OrderPicklistPlugin } from "./plugins/order-picklist";

compileUiExtensions({
  outputPath: path.join(__dirname, "../admin-ui"),
  devMode:false,
  extensions: [OrderPicklistPlugin.ui],
})
  .compile?.()
  .then(() => {
    process.exit(0);
  }).catch((err)=>{
    console.log("error:",err);
    
  });

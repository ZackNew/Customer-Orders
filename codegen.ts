import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // This assumes your server is running on the standard port
  // and with the default admin API path. Adjust accordingly.
  schema: "http://localhost:3000/admin-api",
  config: {
    // This tells codegen that the `Money` scalar is a number
    scalars: { Money: "number" },
    // This ensures generated enums do not conflict with the built-in types.
    namingConvention: { enumValues: "keep" },
  },
  generates: {
    // The path to the generated type file in your
    // plugin directory. Adjust accordingly.
    "src/plugins/picklist-plugin/ui/generated/graphql.ts": {
      documents: "src/plugins/picklist-plugin/**/*.graphql.ts",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
    "src/plugins/order-picklist/ui/generated/graphql.ts": {
      documents: "src/plugins/order-picklist/**/*.graphql.ts",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;

import { SwaggerConfig, RoutesConfig, generateSpec, generateRoutes } from "tsoa";
import { ExtendedSpecConfig, ExtendedRoutesConfig } from "tsoa/dist/cli";

const basePath = "/api",
  entryFile = "./src/index.ts";

const swaggerOptions: ExtendedSpecConfig = {
  version: "1.0.0",
  name: "tsoa-base",
  description: "tsoa-base Documentation",
  schemes: ["https", "http"],
  basePath,
  entryFile,
  specVersion: 3,
  outputDirectory: "./src",
  securityDefinitions: {
    bearer: {
      type: "apiKey",
      in: "header",
      name: "Authorization"
    }
  },
  noImplicitAdditionalProperties: "silently-remove-extras",
  controllerPathGlobs: ["./src/controllers/**/*.controller.ts"],
  specMerging: "recursive",
  spec: {
    paths: {
      "/files/uploadFile": {
        post: {
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: {
                      description: "Description for file",
                      type: "string",
                      format: "binary"
                    }
                  },
                  required: ["file"]
                },
                encoding: {
                  file: {
                    contentType: "image/*"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const routeOptions: ExtendedRoutesConfig = {
  basePath,
  entryFile,
  routesDir: "./src",
  middleware: "express",
  authenticationModule: "./src/services/auth.service.ts",
  noImplicitAdditionalProperties: "silently-remove-extras",
  controllerPathGlobs: ["./src/controllers/**/*.controller.ts"]
};

export const generateRoutesAndSpec = async () => {
  return Promise.all([generateSpec(swaggerOptions), generateRoutes(routeOptions)]);
};

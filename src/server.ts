import ENV from "./utils/env";
import express from "express";
import swaggerUi, { SwaggerUiOptions, SwaggerOptions } from "swagger-ui-express";
import path from "path";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";
import { ValidateError } from "tsoa";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import { createServer } from "http";
import { connect } from "./config/db";
import logger from "./utils/logger";
import { EsClient } from "./config/es";
import { Seed } from "./config/seed";
import ws from "ws";
const swaggerOptions = {
  url: `/swagger.json`,
  docExpansion: "list",
  filter: true
};

class TsoaServer {
  wss: ws.Server;
  app: express.Express;
  server = createServer();
  whitelist = [...ENV.CORS_ORIGINS, "http://localhost"];
  es = new EsClient();
  seed = new Seed();
  corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (this.whitelist.indexOf(origin) !== -1) callback(null, true);
      else callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  };

  /**
   * Initialise the websocket server
   */
  initWss() {
    this.wss = new ws.Server({ clientTracking: true, server: this.server });
  }
  initExpress() {
    this.app = express()
      .use(cors(this.corsOptions))
      .use("/docs", swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions }))
      .use("/swagger.json", (req, res) => {
        res.sendFile(path.join(__dirname, "/swagger.json"));
      })
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));
    RegisterRoutes(this.app);
    this.app.use(this.expressErrorHandler);
    this.app.use("/images", express.static(path.join(__dirname, "../src/assets/uploads/")));
    this.server.on("request", this.app);
  }

  expressErrorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof ValidateError) {
      logger.error(JSON.stringify({ ...err, path: req.path }, null, 2));
    } else {
      res.status(err["status"] ? err["status"] : 500).send(err["message"]);
    }
  }

  /**
   * Setup server to close connections from client that are not responding
   */
  clientPingPong() {
    this.wss.on("connection", (client, req) => {
      console.log("Connextcionsss");
      client.send("ok connected");
      client.on("close", () => {
        console.log("Connection is closed");
      });
    });
  }
  async init() {
    await connect();
    this.initWss();
    this.initExpress();
    this.es.checkEsConnection();
    await this.seed.createUser();
    this.server.listen(ENV.PORT, () => {
      logger.info(`Server listening on port ${ENV.PORT}`);
    });
    this.clientPingPong();
  }
}

const appServer = new TsoaServer();

export default appServer;

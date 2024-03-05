// Inversity
import "reflect-metadata";
import { Container } from "inversify";
import { ApplicationServiceProvider } from "@/infra/Providers/ApplicationServiceProvider";

const container = new Container();
const appServiceProvider = new ApplicationServiceProvider();
appServiceProvider.register(container);

import express from "express";
import PanelRouter from "@/infra/adapters/Express/routes/Panel";
import KudosRouter from "@/infra/adapters/Express/routes/Kudos";
import UserRouter from "@/infra/adapters/Express/routes/UserRouter";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
// import { UserRepositoryType } from "@/domain/User/Repositories/UserRepository";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kudos Board",
      version: "1.0.0",
      description: "API Kudos Board",
    },
    servers: [
      {
        url: "/",
        description: "Base URL",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/infra/adapters/Express/routes/*.ts", "./src/infra/adapters/Express/routes/schemas/*.yaml"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();

app.use(express.json()).use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(swaggerDocs));
});

PanelRouter.setup(app);
KudosRouter.setup(app);
UserRouter.setup(app, container);

export default app;

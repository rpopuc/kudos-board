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
import ApiDocsRouter from "@/infra/adapters/Express/routes/ApiDocsRouter";

const app = express();

ApiDocsRouter.setup(app);
PanelRouter.setup(app);
KudosRouter.setup(app);
UserRouter.setup(app, container);

export default app;

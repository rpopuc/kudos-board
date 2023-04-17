import express from "express";
import PanelRouter from "./routes/Panel"
import KudosRouter from "./routes/Kudos"

const app = express();
PanelRouter.setup(app);
KudosRouter.setup(app);

export default app;
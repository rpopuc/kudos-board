import express from "express";
import PanelRouter from "@/infra/adapters/Express/routes/Panel";
import KudosRouter from "@/infra/adapters/Express/routes/Kudos";

const app = express();

app.use(express.json());

PanelRouter.setup(app);
KudosRouter.setup(app);

export default app;

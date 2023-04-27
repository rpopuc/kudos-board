import { addAliases } from "module-alias";

addAliases({
  "@": __dirname,
});

import express from "express";
import PanelRouter from "@/routes/Panel";
import KudosRouter from "@/routes/Kudos";

const app = express();

app.use(express.json());

PanelRouter.setup(app);
KudosRouter.setup(app);

export default app;

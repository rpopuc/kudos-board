import express from "express";
import PanelController from "../controllers/Panel"

class Panel
{
  static setup(app: express.Application)
  {
    const controller = new PanelController;

    app.get("/panel", controller.index);
  }
}

export default Panel;
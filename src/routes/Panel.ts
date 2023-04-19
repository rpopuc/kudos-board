import express from "express";
import PanelController from "../controllers/Panel";
import CreatePanel from "../domains/useCases/CreatePanel";

class Panel {
  static setup(app: express.Application) {
    const useCase = new CreatePanel()

    const controller = new PanelController(useCase);

    app.get("/panel", controller.index());
    app.post("/panel", controller.store());
  }
}

export default Panel;

import express from "express";
import PanelController from "../controllers/Panel";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PanelRepository from "@/domains/Panel/Repositories/PanelRepository";

class Panel {
  static setup(app: express.Application) {
    const repository = new PanelRepository();

    const useCase = new CreatePanel(repository);

    const controller = new PanelController(useCase);

    app.get("/panel/:slug", controller.index());
    app.post("/panel", controller.store());
  }
}

export default Panel;

import express from "express";
import PanelController from "@/controllers/Panel";

import { Container } from "@/inversify.config";
import { TYPES } from "@/types";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PanelRepositoryInterface from "@/domains/Panel/Repositories/PanelRepository";

class Panel {
  static setup(app: express.Application) {
    const repository = Container.get<PanelRepositoryInterface>(TYPES.PanelRepository);
    const useCase = new CreatePanel(repository);
    const controller = new PanelController(useCase);

    app.post("/panel", controller.store());
    app.get("/panel/:slug", controller.index());
  }
}

export default Panel;

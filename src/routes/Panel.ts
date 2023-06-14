import express from "express";
import PanelController from "@/controllers/PanelController";

import { Container } from "@/inversify.config";
import { TYPES } from "@/types";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PanelRepositoryInterface from "@/domains/Panel/Repositories/PanelRepository";
import DeletePanel from "@/domains/Panel/UseCases/DeletePanel";
import UpdatePanel from "@/domains/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domains/Panel/UseCases/ShowPanel";

class Panel {
  static setup(app: express.Application) {
    const repository = Container.get<PanelRepositoryInterface>(TYPES.PanelRepository);

    const createPanelUseCase = new CreatePanel(repository);
    const deletePanelUseCase = new DeletePanel(repository);
    const updatePanelUseCase = new UpdatePanel(repository);
    const showPanelUseCase = new ShowPanel(repository);

    const controller = new PanelController(
      createPanelUseCase,
      deletePanelUseCase,
      updatePanelUseCase,
      showPanelUseCase,
    );

    app.post("/panel", controller.store());
    app.put("/panel/:slug", controller.update());
    app.delete("/panel/:slug", controller.delete());
    app.get("/panel/:slug", controller.index());
  }
}

export default Panel;

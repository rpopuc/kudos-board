import express from "express";
import PanelController from "@/infra/adapters/Express/controllers/PanelController";

import { Container } from "@/infra/inversify.config";
import { TYPES } from "@/infra/types";
import CreatePanel from "@/domain/Panel/UseCases/CreatePanel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import PanelPresenter from "@/domain/Panel/Presenters/PanelPresenter";
import ArchivePanel from "@/domain/Panel/UseCases/ArchivePanel";

class Panel {
  static setup(app: express.Application) {
    const repository = Container.get<PanelRepositoryInterface>(TYPES.PanelRepository);

    const createPanelUseCase = new CreatePanel(repository);
    const deletePanelUseCase = new DeletePanel(repository);
    const archivePanelUseCase = new ArchivePanel(repository);
    const updatePanelUseCase = new UpdatePanel(repository);
    const showPanelUseCase = new ShowPanel(repository);
    const presenter = new PanelPresenter();

    const controller = new PanelController(
      createPanelUseCase,
      deletePanelUseCase,
      updatePanelUseCase,
      showPanelUseCase,
      archivePanelUseCase,
      presenter,
    );

    app.post("/panel", controller.store());
    app.put("/panel/archive/:slug", controller.archive());
    app.put("/panel/:slug", controller.update());
    app.delete("/panel/:slug", controller.delete());
    app.post("/panel/:slug", controller.show());
  }
}

export default Panel;

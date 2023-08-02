import express from "express";
import { Container } from "@/infra/inversify.config";
import KudosRepositoryInterface from "@/domain/Kudos/Repositories/KudosRepository";
import { TYPES } from "@/infra/types";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";
import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";

class Kudos {
  static setup(app: express.Application) {
    const repository = Container.get<KudosRepositoryInterface>(TYPES.KudosRepository);
    const panelRepository = Container.get<PanelRepositoryInterface>(TYPES.KudosRepository);

    const createKudosUseCase = new CreateKudos(repository);
    const deleteKudosUseCase = new DeleteKudos(repository);
    const updateKudosUseCase = new UpdateKudos(repository, panelRepository);
    const showKudosUseCase = new ShowKudos(repository);
    const archiveKudosUseCase = new ArchiveKudos(repository, panelRepository);

    const controller = new KudosController(
      createKudosUseCase,
      deleteKudosUseCase,
      updateKudosUseCase,
      showKudosUseCase,
      archiveKudosUseCase,
      new KudosPresenter(),
    );

    app.post("/kudos", controller.store());
    app.put("/kudos/archive/:slug", controller.archive());
    app.put("/kudos/:slug", controller.update());
    app.delete("/kudos/:slug", controller.delete());
    app.post("/kudos/:slug", controller.show());
  }
}

export default Kudos;

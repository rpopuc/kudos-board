import express from "express";
import { Container } from "@/infra/inversify.config";
import KudosRepositoryInterface from "@/domain/Kudos/Repositories/KudosRepository";
import { TYPES } from "@/infra/types";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";

class Kudos {
  static setup(app: express.Application) {
    const repository = Container.get<KudosRepositoryInterface>(TYPES.KudosRepository);

    const createKudosUseCase = new CreateKudos(repository);
    const deleteKudosUseCase = new DeleteKudos(repository);

    const controller = new KudosController(createKudosUseCase, deleteKudosUseCase, new KudosPresenter());

    app.post("/kudos", controller.store());
    app.delete("/kudos/:slug", controller.delete());
  }
}

export default Kudos;

import express from "express";
import { Container } from "@/infra/inversify.config";
import KudosRepositoryInterface from "@/domain/Kudos/Repositories/KudosRepository";
import { TYPES } from "@/infra/types";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";

class Kudos {
  static setup(app: express.Application) {
    const repository = Container.get<KudosRepositoryInterface>(TYPES.KudosRepository);

    const createPanelUseCase = new CreateKudos(repository);

    const controller = new KudosController(createPanelUseCase, new KudosPresenter());

    app.post("/kudos", controller.store());
  }
}

export default Kudos;

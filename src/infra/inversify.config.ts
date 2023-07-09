import { Container as BaseContainer } from "inversify";
import { config as dotEnvConfig } from "dotenv";
import { TYPES } from "@/infra/types";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import MemoryPanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import MongoDbPanelRepository from "@/infra/MongoDB/Repositories/PanelRepository";

const Container = new BaseContainer();

dotEnvConfig();

switch (process.env.ENVIRONMENT) {
  case "production":
    Container.bind<PanelRepository>(TYPES.PanelRepository).to(MongoDbPanelRepository);
    break;

  case "development":
    Container.bind<PanelRepository>(TYPES.PanelRepository).to(MemoryPanelRepository);
    break;

  default:
    Container.bind<PanelRepository>(TYPES.PanelRepository).to(MongoDbPanelRepository);
    break;
}

export { Container };

import { Container as BaseContainer } from "inversify";
import { TYPES } from "@/infra/types";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import MemoryPanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import MongoDbPanelRepository from "@/infra/MongoDB/Repositories/PanelRepository";

const Container = new BaseContainer();

// Container.bind<PanelRepository>(TYPES.PanelRepository).to(MemoryPanelRepository);
Container.bind<PanelRepository>(TYPES.PanelRepository).to(MongoDbPanelRepository);

export { Container };

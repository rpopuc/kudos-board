import { Container as BaseContainer } from "inversify";
import { TYPES } from "@/types";
import PanelRepository from "@/domains/Panel/Repositories/PanelRepository";
import MemoryPanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";

const Container = new BaseContainer();

Container.bind<PanelRepository>(TYPES.PanelRepository).to(MemoryPanelRepository);

export { Container };

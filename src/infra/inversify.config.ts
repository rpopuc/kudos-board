import { Container as BaseContainer } from "inversify";
import { TYPES } from "@/infra/types";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import MemoryPanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";

const Container = new BaseContainer();

Container.bind<PanelRepository>(TYPES.PanelRepository).to(MemoryPanelRepository);

export { Container };
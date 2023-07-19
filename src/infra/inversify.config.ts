import "reflect-metadata";
import { Container as BaseContainer } from "inversify";
import { TYPES } from "@/infra/types";

const Container = new BaseContainer();

import { DatabaseInterface } from "@/infra/MongoDB/services/DatabaseInterface";
import { Database } from "@/infra/MongoDB/services/Database";
Container.bind<DatabaseInterface>(TYPES.DatabaseInterface).to(Database);

import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import MongoDbPanelRepository from "@/infra/MongoDB/Repositories/PanelRepository";
Container.bind<PanelRepository>(TYPES.PanelRepository).to(MongoDbPanelRepository);

import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import MongoDbKudosRepository from "@/infra/MongoDB/Repositories/KudosRepository";
Container.bind<KudosRepository>(TYPES.KudosRepository).to(MongoDbKudosRepository);

export { Container };

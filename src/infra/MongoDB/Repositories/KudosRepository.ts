import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "@/infra/types";

import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosRepositoryInterface from "@/domain/Kudos/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import { Kudos as KudosModel } from "@/infra/MongoDB/models/Kudos";
import { DatabaseInterface } from "@/infra/MongoDB/services/DatabaseInterface";
import { UpdateData } from "@/domain/Kudos/Repositories/KudosRepository";

@injectable()
class KudosRepository implements KudosRepositoryInterface {
  constructor(@inject(TYPES.DatabaseInterface) private db: DatabaseInterface) {}

  async create(kudosData: KudosData): Promise<KudosEntity> {
    const kudos = new KudosEntity(kudosData);

    const kudosModel = new KudosModel(
      kudos.slug,
      kudos.panelSlug,
      kudos.title,
      kudos.description,
      kudos.from,
      kudos.to,
      kudos.createdAt,
      new Date(),
      kudos.status,
    );

    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocument = await collection.insertOne(kudosModel);

    if (!kudosDocument._id) {
      throw new Error("Error creating kudos on database");
    }

    return kudos;
  }

  async update({ slug, kudosData }: UpdateData): Promise<KudosEntity | null> {
    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocument = await collection.findFirst({ slug } as KudosModel);

    if (!kudosDocument?._id) {
      return null;
    }

    const status = kudosData.status || kudosDocument.status;

    const kudosModel = new KudosModel(
      // Todo: slug should be immutable?
      slug,
      kudosData.panelSlug,
      kudosData.title,
      kudosData.description,
      kudosData.from,
      kudosData.to,
      kudosDocument.createdAt,
      new Date(),
      status,
    );

    await collection.update(kudosDocument._id, kudosModel);

    return new KudosEntity(kudosData);
  }

  async delete(slug: string): Promise<boolean> {
    return false;
  }

  async archive(slug: string): Promise<boolean> {
    return false;
  }

  async findBySlug(slug: string): Promise<KudosEntity | null> {
    return null;
  }
}

export default KudosRepository;

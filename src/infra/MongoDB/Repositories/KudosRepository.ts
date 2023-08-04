import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "@/infra/types";

import KudosEntity, { Status } from "@/domain/Kudos/Entities/Kudos";
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
    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocument = await collection.findFirst({ slug } as KudosModel);

    if (!kudosDocument?._id) {
      return true;
    }

    return await collection.delete(kudosDocument._id);
  }

  async archive(slug: string): Promise<boolean> {
    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocument = await collection.findFirst({ slug } as KudosModel);

    if (!kudosDocument?._id) {
      return false;
    }

    await collection.update(kudosDocument._id, {
      status: Status.ARCHIVED,
    } as KudosModel);

    return true;
  }

  async findBySlug(slug: string): Promise<KudosEntity | null> {
    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocument = await collection.findFirst({ slug } as KudosModel);

    if (!kudosDocument) {
      return null;
    }

    return new KudosEntity({
      slug: kudosDocument.slug,
      panelSlug: kudosDocument.panelSlug,
      title: kudosDocument.title,
      description: kudosDocument.description,
      from: kudosDocument.from,
      to: kudosDocument.to,
      createdAt: kudosDocument.createdAt,
      updatedAt: kudosDocument.updatedAt,
      status: kudosDocument.status,
    });
  }

  async findByPanelSlug(panelSlug: string): Promise<KudosEntity[]> {
    await this.db.connect();
    const collection = await this.db.getCollection<KudosModel>("kudos");
    const kudosDocuments = await collection.find({ panelSlug } as KudosModel);

    return kudosDocuments.map(kudosDocument => {
      return new KudosEntity({
        slug: kudosDocument.slug,
        panelSlug: kudosDocument.panelSlug,
        title: kudosDocument.title,
        description: kudosDocument.description,
        from: kudosDocument.from,
        to: kudosDocument.to,
        createdAt: kudosDocument.createdAt,
        updatedAt: kudosDocument.updatedAt,
        status: kudosDocument.status,
      });
    }) as KudosEntity[];
  }
}

export default KudosRepository;

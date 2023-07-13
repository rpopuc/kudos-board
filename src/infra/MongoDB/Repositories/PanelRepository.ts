import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "@/infra/types";

import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import { UpdateData } from "@/domain/Panel/Repositories/PanelRepository";
import { Panel as PanelModel } from "@/infra/MongoDB/models/Panel";
import { DatabaseInterface } from "@/infra/MongoDB/services/DatabaseInterface";
import BCryptPassword from "@/infra/shared/ValueObjects/BCryptPassword";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

@injectable()
class PanelRepository implements PanelRepositoryInterface {
  constructor(@inject(TYPES.DatabaseInterface) private db: DatabaseInterface) {}

  async create(panelData: PanelData): Promise<PanelEntity> {
    const panel = new PanelEntity(panelData);

    const panelModel = new PanelModel(
      panel.slug,
      panel.title,
      panel.owner,
      panel.createdAt,
      panel.updatedAt,
      panel.password.getValue(),
      panel.status,
      panel.clientPassword?.getValue(),
    );

    await this.db.connect();
    const collection = await this.db.getCollection<PanelModel>("panels");
    const panelDocument = await collection.insertOne(panelModel);

    if (!panelDocument._id) {
      throw new Error("Error creating panel on database");
    }

    return panel;
  }

  async update({ slug, panelData }: UpdateData): Promise<PanelEntity | null> {
    await this.db.connect();
    const collection = await this.db.getCollection<PanelModel>("panels");
    const panelDocument = await collection.findFirst({ slug } as PanelModel);

    if (!panelDocument?._id) {
      return null;
    }

    const status = panelData.status || panelDocument.status;
    const panelModel = new PanelModel(
      // Todo: slug should be immutable?
      slug,
      panelData.title,
      panelData.owner,
      panelDocument.createdAt,
      new Date(),
      panelData.password.getValue(),
      status,
      panelData.clientPassword?.getValue(),
    );
    await collection.update(panelDocument._id, panelModel);

    return new PanelEntity(panelData);
  }

  async delete(slug: string): Promise<boolean> {
    await this.db.connect();
    const collection = await this.db.getCollection<PanelModel>("panels");
    const panelDocument = await collection.findFirst({ slug } as PanelModel);

    if (!panelDocument?._id) {
      return true;
    }

    return await collection.delete(panelDocument._id);
  }

  async archive(slug: string): Promise<boolean> {
    await this.db.connect();
    const collection = await this.db.getCollection<PanelModel>("panels");
    const panelDocument = await collection.findFirst({ slug } as PanelModel);

    if (!panelDocument?._id) {
      return false;
    }

    await collection.update(panelDocument._id, {
      status: Status.ARCHIVED,
    } as PanelModel);

    return true;
  }

  async findBySlug(slug: string): Promise<PanelEntity | null> {
    await this.db.connect();
    const collection = await this.db.getCollection<PanelModel>("panels");
    const panelDocument = await collection.findFirst({ slug } as PanelModel);

    if (!panelDocument) {
      return null;
    }

    return new PanelEntity({
      slug: panelDocument.slug,
      title: panelDocument.title,
      owner: panelDocument.owner,
      createdAt: panelDocument.createdAt,
      updatedAt: panelDocument.updatedAt,
      password: BCryptPassword.fromHashedValue(panelDocument.password),
      status: panelDocument.status,
      clientPassword: panelDocument.clientPassword
        ? BCryptPassword.fromHashedValue(panelDocument.clientPassword)
        : null,
    });
  }
}

export default PanelRepository;

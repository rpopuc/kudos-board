import { Database } from "@/infra/MongoDB/services/Database";
import { injectable, inject } from "inversify";
import "reflect-metadata";

import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import { UpdateData } from "@/domain/Panel/Repositories/PanelRepository";
import { Panel as PanelModel } from "@/infra/MongoDB/models/Panel";

@injectable()
class PanelRepository implements PanelRepositoryInterface {
  db: Database;

  constructor() {
    this.db = new Database();
  }

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
    const collection = await this.db.getCollection("panels");
    const panelDocument = await collection.insertOne(panelModel);
    panel.id = panelDocument._id?.toString() || "";

    return panel;
  }

  update({ slug, panelData }: UpdateData): PanelEntity | null {
    const panel = this.findBySlug(slug);

    return panel;
  }

  delete(slug: string): boolean {
    return true;
  }

  archive(slug: string): boolean {
    const panel = this.findBySlug(slug);

    if (!panel) {
      return false;
    }

    panel.status = Status.ARCHIVED;

    return true;
  }

  findBySlug(slug: string): PanelEntity | null {
    return null;
  }
}

export default PanelRepository;

import { injectable, inject } from "inversify";
import "reflect-metadata";

import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import { UpdateData } from "@/domain/Panel/Repositories/PanelRepository";

@injectable()
class PanelRepository implements PanelRepositoryInterface {
  private panels: PanelEntity[];

  constructor() {
    this.panels = [];
  }

  async create(panelData: PanelData): Promise<PanelEntity> {
    const panel = new PanelEntity(panelData);

    this.panels.push(panel);

    return panel;
  }

  async update({ slug, panelData }: UpdateData): Promise<PanelEntity | null> {
    const panel = this.findBySlug(slug);

    return panel;
  }

  async delete(slug: string): Promise<boolean> {
    this.panels = this.panels.filter(panel => panel.slug !== slug);

    return true;
  }

  async archive(slug: string): Promise<boolean> {
    const panel = await this.findBySlug(slug);

    if (!panel) {
      return false;
    }

    panel.status = Status.ARCHIVED;

    return true;
  }

  async findBySlug(slug: string): Promise<PanelEntity | null> {
    const panel = this.panels.find(panel => panel.slug == slug);

    return panel ? panel : null;
  }
}

export default PanelRepository;

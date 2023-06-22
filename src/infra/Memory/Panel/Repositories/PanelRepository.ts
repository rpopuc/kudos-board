import { injectable, inject } from "inversify";
import "reflect-metadata";

import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";

@injectable()
class PanelRepository implements PanelRepositoryInterface {
  private panels: PanelEntity[];

  constructor() {
    this.panels = [];
  }

  create(panelData: PanelData): PanelEntity {
    const panel = new PanelEntity(panelData);

    this.panels.push(panel);

    return panel;
  }

  update(slug: string, panelData: PanelData): PanelEntity | null {
    const panel = this.findBySlug(slug);

    return panel;
  }

  delete(slug: string): boolean {
    this.panels = this.panels.filter(panel => panel.slug !== slug);

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
    const panel = this.panels.find(panel => panel.slug == slug);

    return panel ? panel : null;
  }
}

export default PanelRepository;

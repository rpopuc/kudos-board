import { injectable, inject } from "inversify";
import "reflect-metadata";

import PanelEntity from "@/domains/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";

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

  findBySlug(slug: string): PanelEntity | null {
    const panel = this.panels.find(panel => panel.slug == slug);

    return panel ? panel : null;
  }
}

export default PanelRepository;

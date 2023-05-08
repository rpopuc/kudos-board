import PanelEntity from "@/domains/Panel/Entities/Panel";
import PanelRepositoryInterface from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";

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

  findBySlug(slug: string): PanelEntity | undefined {
    return this.panels.find(panel => panel.slug == slug);
  }
}

export default PanelRepository;
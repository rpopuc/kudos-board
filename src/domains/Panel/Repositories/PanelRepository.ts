import PanelEntity from "@/domains/Panel/Entities/Panel";

class PanelRepository {
  private panels: PanelEntity[];

  constructor() {
    this.panels = [];
  }

  /**
   * todo: set a type for panelData
   */
  create(panelData: any): PanelEntity {
    const panel = new PanelEntity(panelData);
    this.panels.push(panel);
    return panel;
  }

  findBySlug(slug: string): PanelEntity | undefined {
    return this.panels.find(panel => panel.slug == slug);
  }
}

export default PanelRepository;

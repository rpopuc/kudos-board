import PanelEntity from "@/domains/Panel/Entities/Panel";

class PanelRepository {
  create(panelData: any): PanelEntity {
    return new PanelEntity(panelData);
  }
}

export default PanelRepository;

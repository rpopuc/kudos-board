import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";

class CreatePanel {
  constructor(private repository: Repository) {}

  handle(panelData: any): PanelEntity {
    return this.repository.create(panelData);
  }
}

export default CreatePanel;

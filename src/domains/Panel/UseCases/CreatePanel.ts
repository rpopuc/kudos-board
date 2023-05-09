import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";

class CreatePanel {
  constructor(private repository: Repository) {}

  async handle(panelData: any): Promise<PanelEntity> {
    return this.repository.create(panelData);
  }
}

export default CreatePanel;

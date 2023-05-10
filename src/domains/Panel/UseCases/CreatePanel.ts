import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";

class CreatePanel {
  constructor(private repository: Repository) {}

  validate(panelData: PanelData): void {
    if (!panelData.title) {
      throw new Error("Does not have a title");
    }

    if (!panelData.owner) {
      throw new Error("Does not have an owner");
    }

    if (!panelData.password) {
      throw new Error("Does not have a password");
    }
  }

  async handle(panelData: PanelData): Promise<PanelEntity> {
    this.validate(panelData);

    return this.repository.create(panelData);
  }
}

export default CreatePanel;

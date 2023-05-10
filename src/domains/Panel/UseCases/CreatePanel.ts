import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";
import EmptyData from "@/domains/shared/exceptions/EmptyData";

class CreatePanel {
  constructor(private repository: Repository) {}

  validate(panelData: PanelData): void {
    if (!panelData.title) {
      throw new EmptyData("EMPTY_TITLE", "title");
    }

    if (!panelData.owner) {
      throw new EmptyData("EMPTY_OWNER", "owner");
    }

    if (!panelData.password) {
      throw new EmptyData("EMPTY_PASSWORD", "password");
    }
  }

  async handle(panelData: PanelData): Promise<PanelEntity> {
    this.validate(panelData);

    return this.repository.create(panelData);
  }
}

export default CreatePanel;

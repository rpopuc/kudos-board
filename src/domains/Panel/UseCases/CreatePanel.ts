import PanelEntity from "../Entities/Panel";
import Repository from "../Repositories/PanelRepository"

class CreatePanel {
  constructor(
    private repository: Repository
  ) {}

  handle(panelData: any): PanelEntity {
    return this.repository.create(panelData);
  }
}

export default CreatePanel;

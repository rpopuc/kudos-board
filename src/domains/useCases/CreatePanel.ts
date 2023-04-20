import PanelEntity from "../entities/Panel";

class CreatePanel {
  handle(panelData: any): PanelEntity {
    const panel = new PanelEntity(panelData);

    return panel;
  }
}

export default CreatePanel;

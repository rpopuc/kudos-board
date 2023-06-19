import Panel from "@/domains/Panel/Entities/Panel";

class PanelPresenter {
  single(panel: Panel): any {
    const { owner, title, slug, createdAt } = panel;

    return { owner, title, slug, createdAt };
  }
}

export default PanelPresenter;

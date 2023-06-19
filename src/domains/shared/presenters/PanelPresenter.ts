import Panel from "@/domains/Panel/Entities/Panel";

export type PanelPresentation = {
  owner: string;
  title: string;
  slug: string;
  createdAt: Date;
};

class PanelPresenter {
  single(panel: Panel): PanelPresentation {
    const { owner, title, slug, createdAt } = panel;

    return { owner, title, slug, createdAt };
  }
}

export default PanelPresenter;

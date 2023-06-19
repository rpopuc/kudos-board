import Panel from "@/domains/Panel/Entities/Panel";
import PanelPresenter from "@/domains/shared/presenters/PanelPresenter";

describe("PanelPresenter", () => {
  it("should present a single Panel", () => {
    const presenter = new PanelPresenter();

    const panel = new Panel({
      owner: "owner",
      title: "title",
    });

    expect(presenter.single(panel)).toMatchObject({
      owner: "owner",
      title: "title",
    });
  });
});

import CreatePanel from "../../../src/domains/useCases/CreatePanel";
import PanelEntity from "../../../src/domains/entities/Panel";

describe("CreatePanel", () => {
  let createPanel: CreatePanel;

  beforeEach(() => {
    createPanel = new CreatePanel();
  });

  describe("handle", () => {
    it("should return a new panel entity with the correct data", () => {
      const panelData = {
        title: "Example Title",
        slug: "example-slug",
        owner: "Example Owner",
        createdAt: "2022-04-19",
      };

      const panel = createPanel.handle(panelData);

      expect(panel).toBeInstanceOf(PanelEntity);
      expect(panel.title).toEqual(panelData.title);
      expect(panel.slug).toEqual(panelData.slug);
      expect(panel.owner).toEqual(panelData.owner);
      expect(panel.createdAt).toEqual(panelData.createdAt);
    });
  });
});

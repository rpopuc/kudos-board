import CreatePanel from "../../../../src/domains/Panel/UseCases/CreatePanel";
import PanelEntity from "../../../../src/domains/Panel/Entities/Panel";
import Repository from "../../../../src/domains/Panel/Repositories/PanelRepository";

describe("CreatePanel", () => {
  describe("handle", () => {
    it("should return a new panel entity with the correct data", () => {
      const panelData = {
        title: "Example Title",
        owner: "Example Owner",
        createdAt: "2022-04-19",
      };
      const panelRepository = new Repository();
      panelRepository.create = jest.fn().mockReturnValue(new PanelEntity(panelData));

      const createPanel = new CreatePanel(panelRepository);
      const panel = createPanel.handle(panelData);

      expect(panelRepository.create).toHaveBeenCalledTimes(1);
      expect(panelRepository.create).toHaveBeenCalledWith(panelData);
      expect(panel).toBeInstanceOf(PanelEntity);
      expect(panel.title).toEqual(panelData.title);
      expect(panel.slug).not.toBeUndefined();
      expect(panel.owner).toEqual(panelData.owner);
      expect(panel.createdAt).toEqual(panelData.createdAt);
    });
  });
});
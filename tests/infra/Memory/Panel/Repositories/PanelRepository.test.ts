import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import Panel from "@/domains/Panel/Entities/Panel";
import PanelData from "@/domains/Panel/DTO/PanelData";

describe("PanelRepository", () => {
  describe("create", () => {
    it("should create a PanelEntity", () => {
      const panelRepository = new PanelRepository();
      const panelData = {
        title: "Test Panel",
      } as PanelData;

      const panelEntity = panelRepository.create(panelData);

      expect(panelEntity).toBeInstanceOf(Panel);
      expect(panelEntity.slug).not.toBeUndefined();
      expect(panelEntity.title).toBe(panelData.title);
    });

    it("should find a PanelEntity by slug", () => {
      const panelRepository = new PanelRepository();
      const panelData = {
        title: "Test Panel",
      } as PanelData;

      const panelEntity = panelRepository.create(panelData);
      const foundPanel = panelRepository.findBySlug(panelEntity.slug);

      expect(foundPanel).not.toBeUndefined();
      expect(foundPanel?.title).toBe(panelData.title);
    });

    it("should not find a invalid PanelEntity by slug", () => {
      const panelRepository = new PanelRepository();
      const foundPanel = panelRepository.findBySlug("invalid_slug");

      expect(foundPanel).toBeUndefined();
    });
  });
});

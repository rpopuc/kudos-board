import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import Panel, { Status } from "@/domain/Panel/Entities/Panel";
import PanelData from "@/domain/Panel/DTO/PanelData";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("PanelRepository", () => {
  describe("create", () => {
    it("should create a PanelEntity", () => {
      const panelRepository = new PanelRepository();
      const panelData = {
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const panelEntity = panelRepository.create(panelData);

      expect(panelEntity).toBeInstanceOf(Panel);
      expect(panelEntity.slug).not.toBeUndefined();
      expect(panelEntity.title).toBe(panelData.title);
    });

    test("should update an existing panel correctly", () => {
      const panelData: PanelData = {
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const updatedPanelData: PanelData = {
        owner: "123",
        title: "Test Panel Updated",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const Panel = new PanelRepository();

      const createdPanel = Panel.create(panelData);
      const updatedPanel = Panel.update(createdPanel.slug, updatedPanelData);

      expect(updatedPanel).toEqual(createdPanel);
    });

    test("should delete an existing panel correctly", () => {
      const panelData: PanelData = {
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const panelRepository = new PanelRepository();

      const createdPanel = panelRepository.create(panelData);
      const response = panelRepository.delete(createdPanel.slug);

      expect(response).toBeTruthy();
    });

    test("should delete an existing panel correctly", () => {
      const panelData: PanelData = {
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const panelRepository = new PanelRepository();

      const createdPanel = panelRepository.create(panelData);
      const response = panelRepository.archive(createdPanel.slug);

      expect(response).toBeTruthy();
      expect(createdPanel.status).toBe(Status.ARCHIVED);
    });

    test("should delete an existing panel correctly", () => {
      const panelRepository = new PanelRepository();

      const response = panelRepository.archive("slug");

      expect(response).toBeFalsy();
    });

    it("should find a PanelEntity by slug", () => {
      const panelRepository = new PanelRepository();
      const panelData = {
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const panelEntity = panelRepository.create(panelData);
      const foundPanel = panelRepository.findBySlug(panelEntity.slug);

      expect(foundPanel).not.toBeUndefined();
      expect(foundPanel?.title).toBe(panelData.title);
    });

    it("should not find a invalid PanelEntity by slug", () => {
      const panelRepository = new PanelRepository();
      const foundPanel = panelRepository.findBySlug("invalid_slug");

      expect(foundPanel).toBeNull();
    });
  });
});

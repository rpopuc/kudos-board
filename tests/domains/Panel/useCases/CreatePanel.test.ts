import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("CreatePanel", () => {
  describe("handle", () => {
    let repositoryMock: Repository;
    let createPanel: CreatePanel;

    beforeEach(() => {
      repositoryMock = {
        create: jest.fn().mockImplementation((panelData: PanelData) => {
          return Promise.resolve({
            id: "123",
            title: panelData.title,
            owner: panelData.owner,
            password: panelData.password,
          });
        }),
        update: jest.fn(),
        archive: jest.fn(),
        delete: jest.fn(),
        findBySlug: jest.fn(),
      } as Repository;

      createPanel = new CreatePanel(repositoryMock);
    });

    it("should return a new panel entity with the correct data", async () => {
      const panelData = {
        title: "Example Title",
        owner: "Example Owner",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const memoryPanelEntity = new PanelEntity(panelData);

      const panelRepository = {
        create: jest.fn().mockReturnValue(memoryPanelEntity),
        archive: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findBySlug: jest.fn(),
      } as Repository;

      const createPanel = new CreatePanel(panelRepository);
      const response = await createPanel.handle(panelData);

      expect(panelRepository.create).toHaveBeenCalledTimes(1);
      expect(panelRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: panelData.title,
          owner: panelData.owner,
          password: panelData.password,
        }),
      );
      expect(response.panel).toStrictEqual(memoryPanelEntity);
    });

    it("should return an error if title is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "",
        owner: "Panel owner",
        password: new PlainTextPassword("Panel password"),
      };

      const response = await createPanel.handle(invalidPanelData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have title");
      expect(response.errors[0].status).toBe("EMPTY_TITLE");
      expect(response.panel).toBe(null);
    });

    it("should return an error if owner is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "Panel title",
        owner: "",
        password: new PlainTextPassword("Panel password"),
      };

      const response = await createPanel.handle(invalidPanelData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have owner");
      expect(response.errors[0].status).toBe("EMPTY_OWNER");
      expect(response.panel).toBe(null);
    });

    it("should return an error if password is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "Panel title",
        owner: "Panel owner",
        password: new PlainTextPassword(""),
      };

      const response = await createPanel.handle(invalidPanelData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have password");
      expect(response.errors[0].status).toBe("EMPTY_PASSWORD");
      expect(response.panel).toBe(null);
    });
  });
});

import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PanelEntity from "@/domains/Panel/Entities/Panel";
import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";

describe("CreatePanel", () => {
  describe("handle", () => {
    let repositoryMock: Repository;
    let createPanel: CreatePanel;

    beforeEach(() => {
      repositoryMock = jest.mock("@/domains/Panel/Repositories/PanelRepository", () => {
        return jest.fn().mockImplementation(() => {
          return {
            create: jest.fn((panelData: PanelData) => {
              return Promise.resolve({
                id: "123",
                title: panelData.title,
                owner: panelData.owner,
                password: panelData.password,
              });
            }),
            findBySlug: jest.fn(() => {}),
          };
        });
      }) as unknown as Repository;

      createPanel = new CreatePanel(repositoryMock);
    });

    it("should return a new panel entity with the correct data", () => {
      const panelData = {
        title: "Example Title",
        owner: "Example Owner",
        createdAt: "2022-04-19",
        password: "123456",
      } as PanelData;

      const panelRepository = {
        create: jest.fn().mockReturnValue(new PanelEntity(panelData)),
        findBySlug: jest.fn(),
      } as Repository;

      const createPanel = new CreatePanel(panelRepository);
      createPanel.handle(panelData);

      expect(panelRepository.create).toHaveBeenCalledTimes(1);
      expect(panelRepository.create).toHaveBeenCalledWith(panelData);
    });

    it("should throw an error if title is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "",
        owner: "Panel owner",
        password: "Panel password",
      };

      await expect(createPanel.handle(invalidPanelData)).rejects.toThrow("Does not have title");
    });

    it("should throw an error if owner is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "Panel title",
        owner: "",
        password: "Panel password",
      };

      await expect(createPanel.handle(invalidPanelData)).rejects.toThrow("Does not have owner");
    });

    it("should throw an error if password is missing", async () => {
      const invalidPanelData: PanelData = {
        title: "Panel title",
        owner: "Panel owner",
        password: "",
      };

      await expect(createPanel.handle(invalidPanelData)).rejects.toThrow("Does not have password");
    });
  });
});

import DeletePanel from "@/domains/Panel/UseCases/DeletePanel";
import PanelEntity from "@/domains/Panel/Entities/Panel";
import PanelRepository from "@/domains/Panel/Repositories/PanelRepository";
import DeletePanelErrorResponse from "@/domains/Panel/UseCases/Response/DeletePanelErrorResponse";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domains/Panel/DTO/PanelData";

describe("DeletePanel", () => {
  test("should delete an existing panel successfuly", async () => {
    const panelData = {
      title: "Example Title",
      owner: "Example Owner",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const memoryPanelEntity = new PanelEntity(panelData);

    const mockedRepository = {
      create: jest.fn().mockReturnValue(memoryPanelEntity),
      update: jest.fn(),
      delete: jest.fn().mockReturnValue(true),
      findBySlug: jest.fn(),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const panel = mockedRepository.create(panelData);

    const deletionResponse = await deletePanel.handle(panel.slug);

    expect(deletionResponse.ok).toBe(true);
  });

  test("should throw an error when attempting to delete a non-existent panel", async () => {
    const mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockReturnValue(false),
      findBySlug: jest.fn(),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const panelSlug = "panel";
    const deletionResponse = await deletePanel.handle(panelSlug);

    expect(deletionResponse).toBeInstanceOf(DeletePanelErrorResponse);
    expect(deletionResponse.ok).toBe(false);
  });
});

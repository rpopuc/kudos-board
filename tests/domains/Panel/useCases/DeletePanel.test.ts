import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import PanelEntity from "@/domain/Panel/Entities/Panel";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import DeletePanelErrorResponse from "@/domain/Panel/UseCases/Response/DeletePanelErrorResponse";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domain/Panel/DTO/PanelData";

describe("DeletePanel", () => {
  test("should delete an existing panel successfuly", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const memoryPanelEntity = new PanelEntity(panelData);

    const mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn().mockReturnValue(true),
      findBySlug: jest.fn().mockReturnValue(memoryPanelEntity),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const operationResponse = await deletePanel.handle({ panelSlug: memoryPanelEntity.slug, userId: "1" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return a success when trying to delete a non-existent panel", async () => {
    const mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn().mockReturnValue(false),
      findBySlug: jest.fn(),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const panelSlug = "panel";
    const operationResponse = await deletePanel.handle({ panelSlug, userId: "1" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return an error when trying to delete a panel", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const memoryPanelEntity = new PanelEntity(panelData);

    const mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn().mockReturnValue(false),
      findBySlug: jest.fn().mockReturnValue(memoryPanelEntity),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const operationResponse = await deletePanel.handle({ panelSlug: memoryPanelEntity.slug, userId: "1" });

    expect(operationResponse).toBeInstanceOf(DeletePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("PANEL_NOT_DELETED");
    expect(operationResponse.ok).toBe(false);
  });

  test("should return an error when trying to delete a panel from another owner", async () => {
    const panelData = {
      title: "Example Title",
      owner: "2",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn().mockReturnValue(false),
      findBySlug: jest.fn().mockReturnValue(new PanelEntity(panelData)),
    } as PanelRepository;

    const deletePanel = new DeletePanel(mockedRepository);

    const panelSlug = "panel";
    const operationResponse = await deletePanel.handle({ panelSlug, userId: "1" });

    expect(operationResponse).toBeInstanceOf(DeletePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.ok).toBe(false);
  });
});

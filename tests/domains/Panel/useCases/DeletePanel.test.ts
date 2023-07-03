import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import PanelEntity from "@/domain/Panel/Entities/Panel";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import DeletePanelErrorResponse from "@/domain/Panel/UseCases/Response/DeletePanelErrorResponse";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domain/Panel/DTO/PanelData";

describe("DeletePanel", () => {
  let panelRepository: PanelRepository;
  let panel: PanelEntity;
  let panelData: PanelData;

  beforeEach(() => {
    panelRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as PanelRepository;

    panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    panel = new PanelEntity(panelData);
  });

  test("should delete an existing panel successfuly", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const panel = new PanelEntity(panelData);

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);
    jest.spyOn(panelRepository, "delete").mockReturnValue(true);

    const deletePanel = new DeletePanel(panelRepository);

    const operationResponse = await deletePanel.handle({ panelSlug: panel.slug, userId: "1" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return a success when trying to delete a non-existent panel", async () => {
    jest.spyOn(panelRepository, "delete").mockReturnValue(true);

    const deletePanel = new DeletePanel(panelRepository);
    const operationResponse = await deletePanel.handle({ panelSlug: "panel", userId: "1" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return an error when trying to delete a panel", async () => {
    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);
    jest.spyOn(panelRepository, "delete").mockReturnValue(false);

    const deletePanel = new DeletePanel(panelRepository);

    const operationResponse = await deletePanel.handle({ panelSlug: panel.slug, userId: "1" });

    expect(operationResponse).toBeInstanceOf(DeletePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("PANEL_NOT_DELETED");
    expect(operationResponse.ok).toBe(false);
  });

  test("should return an error when trying to delete a panel from another owner", async () => {
    panel.owner = "2";

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);
    jest.spyOn(panelRepository, "delete").mockReturnValue(false);

    const deletePanel = new DeletePanel(panelRepository);

    const operationResponse = await deletePanel.handle({ panelSlug: "panel", userId: "1" });

    expect(operationResponse).toBeInstanceOf(DeletePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.ok).toBe(false);
  });
});

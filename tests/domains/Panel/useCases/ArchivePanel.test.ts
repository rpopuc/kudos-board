import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domain/Panel/DTO/PanelData";
import ArchivePanel from "@/domain/Panel/UseCases/ArchivePanel";
import ArchivePanelErrorResponse from "@/domain/Panel/UseCases/Response/ArchivePanelErrorResponse";

describe("ArchivePanel", () => {
  let repository: PanelRepository;

  beforeEach(() => {
    repository = new PanelRepository();
  });

  test("should archive an existing panel successfully", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const panel = new PanelEntity(panelData);

    jest.spyOn(repository, "findBySlug").mockImplementation(() => panel);

    const archivePanel = new ArchivePanel(repository);

    const operationResponse = await archivePanel.handle({ panelSlug: panel.slug, userId: "1" });

    expect(operationResponse.ok).toBe(true);
    expect(panel.status).toBe(Status.ARCHIVED);
  });

  test("should not be able to archive a non existing panel successfully", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const panel = new PanelEntity(panelData);

    jest.spyOn(repository, "findBySlug").mockImplementation(() => null);

    const archivePanel = new ArchivePanel(repository);

    const operationResponse = await archivePanel.handle({ panelSlug: panel.slug, userId: "1" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse.errors[0].status).toBe("PANEL_NOT_FOUND");
    expect(operationResponse.errors[0].message).toBe("You can not archive a panel that does not exist.");
    expect(panel.status).toBe(Status.ACTIVE);
  });

  it("should return an error if the user is not the panel's owner", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const panel = new PanelEntity(panelData);

    jest.spyOn(repository, "findBySlug").mockImplementation(() => panel);

    const archivePanel = new ArchivePanel(repository);

    const operationResponse = await archivePanel.handle({ panelSlug: panel.slug, userId: "2" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchivePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.errors[0].message).toBe("You can not archive a panel that is not yours.");
  });

  it("should return an error if the archive action failed", async () => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    const panel = new PanelEntity(panelData);

    jest.spyOn(repository, "findBySlug").mockImplementation(() => panel);
    jest.spyOn(repository, "archive").mockImplementation(() => false);

    const archivePanel = new ArchivePanel(repository);

    const operationResponse = await archivePanel.handle({ panelSlug: panel.slug, userId: "1" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchivePanelErrorResponse);
    expect(operationResponse.errors[0].status).toBe("PANEL_NOT_ARCHIVED");
    expect(operationResponse.errors[0].message).toBe("Internal error while archiving the panel.");
  });
});

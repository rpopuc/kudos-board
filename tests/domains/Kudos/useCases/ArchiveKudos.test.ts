import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import KudosEntity, { Status } from "@/domain/Kudos/Entities/Kudos";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import ArchiveKudosErrorResponse from "@/domain/shared/Responses/ArchiveErrorResponse";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import Panel from "@/domain/Panel/Entities/Panel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import Kudos from "@/domain/Kudos/Entities/Kudos";

describe("ArchiveKudos", () => {
  let kudosRepository: KudosRepository;
  let panelRepository: PanelRepository;
  let kudosData: KudosData;
  let kudos: KudosEntity;

  beforeEach(() => {
    kudosData = {
      title: "Example Title",
      description: "",
      from: { id: "user-id", name: "User 1" },
      to: "User 2",
      panelSlug: "panel-slug-1",
    } as KudosData;

    kudos = new KudosEntity(kudosData);

    kudosRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as KudosRepository;

    panelRepository = {
      findBySlug: jest.fn(),
    } as Partial<PanelRepository> as PanelRepository;
  });

  test("should archive an existing kudos successfully", async () => {
    jest.spyOn(kudosRepository, "findBySlug").mockImplementation(async () => kudos);
    jest.spyOn(kudosRepository, "archive").mockImplementation(async () => true);

    const archivePanel = new ArchiveKudos(kudosRepository, panelRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should not be able to archive a non existing kudos", async () => {
    jest.spyOn(kudosRepository, "findBySlug").mockImplementation(async () => null);
    const archive = jest.spyOn(kudosRepository, "archive");

    const archivePanel = new ArchiveKudos(kudosRepository, panelRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_FOUND");
    expect(operationResponse.errors[0].message).toBe("You can not archive a kudos that does not exist.");
    expect(archive).not.toHaveBeenCalled();
  });

  it("should return an error if the user is not the kudos's owner", async () => {
    jest.spyOn(kudosRepository, "findBySlug").mockImplementation(async () => kudos);
    const archive = jest.spyOn(kudosRepository, "archive");

    const archivePanel = new ArchiveKudos(kudosRepository, panelRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "invalid-user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchiveKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.errors[0].message).toBe("You can not archive a kudos that is not yours.");
    expect(archive).not.toHaveBeenCalled();
  });

  it("should be able to archive the kudos with panel's owner id", async () => {
    jest.spyOn(kudosRepository, "findBySlug").mockImplementation(async () => kudos);
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData = {
      panelSlug: "panel-slug",
      from: { name: "Owner", id: "owner-id" },
      status: Status.ACTIVE,
    } as Partial<Kudos> as Kudos;

    const existingPanel = {
      title: "Old Title",
      owner: "panel-owner",
      password: new PlainTextPassword("oldPassword"),
      updatedAt: currentUpdatedAt,
    } as Partial<Panel> as Panel;

    kudosRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    panelRepository.findBySlug = jest.fn().mockReturnValue(existingPanel);
    kudosRepository.archive = jest.fn().mockImplementation(() => true);

    const archivePanel = new ArchiveKudos(kudosRepository, panelRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "panel-owner" });

    expect(operationResponse.ok).toBe(true);
    expect(kudosRepository.archive).toHaveBeenCalledTimes(1);
  });

  it("should return an error if the archive action failed", async () => {
    jest.spyOn(kudosRepository, "findBySlug").mockImplementation(async () => kudos);
    jest.spyOn(kudosRepository, "archive").mockImplementation(async () => false);

    const archivePanel = new ArchiveKudos(kudosRepository, panelRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchiveKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_ARCHIVED");
    expect(operationResponse.errors[0].message).toBe("Internal error while archiving the kudos.");
  });
});

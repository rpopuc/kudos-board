import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosEntity, { Status } from "@/domain/Kudos/Entities/Kudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import DeleteKudosErrorResponse from "@/domain/shared/Responses/DeleteErrorResponse";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import DeleteKudosResponse from "@/domain/shared/Responses/DeleteDataResponse";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import Kudos from "@/domain/Kudos/Entities/Kudos";
import Panel from "@/domain/Panel/Entities/Panel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("DeleteKudos", () => {
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

  test("should delete an existing kudos successfuly", async () => {
    kudosRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    kudosRepository.delete = jest.fn().mockReturnValue(true);

    const deleteKudos = new DeleteKudos(kudosRepository, panelRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return a DeleteKudosResponse when trying to delete a non-existent kudos", async () => {
    kudosRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(kudosRepository, panelRepository);

    const slug = "kudos";
    const operationResponse = await deleteKudos.handle({ slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
    expect(operationResponse).toBeInstanceOf(DeleteKudosResponse);
  });

  test("should return a DeleteKudosErrorResponse when trying to delete a kudos", async () => {
    kudosRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    kudosRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(kudosRepository, panelRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse).toBeInstanceOf(DeleteKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_DELETED");
    expect(operationResponse.ok).toBe(false);
  });

  test("should return an error when trying to delete a kudos from another owner", async () => {
    kudosRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    kudosRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(kudosRepository, panelRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "invalid-user-id" });

    expect(operationResponse).toBeInstanceOf(DeleteKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.ok).toBe(false);
  });

  it("should be able to archive the kudos with panel's owner id", async () => {
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
    kudosRepository.delete = jest.fn().mockImplementation(() => true);

    const deleteKudos = new DeleteKudos(kudosRepository, panelRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "panel-owner" });

    expect(operationResponse.ok).toBe(true);
    expect(kudosRepository.delete).toHaveBeenCalledTimes(1);
  });
});

import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import DeleteKudosErrorResponse from "@/domain/shared/Responses/DeleteErrorResponse";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import DeleteKudosResponse from "@/domain/Kudos/UseCases/Responses/DeleteKudosResponse";

describe("DeleteKudos", () => {
  let mockedRepository: KudosRepository;
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

    mockedRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as KudosRepository;
  });

  test("should delete an existing kudos successfuly", async () => {
    mockedRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    mockedRepository.delete = jest.fn().mockReturnValue(true);

    const deleteKudos = new DeleteKudos(mockedRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should return a DeleteKudosResponse when trying to delete a non-existent kudos", async () => {
    mockedRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(mockedRepository);

    const slug = "kudos";
    const operationResponse = await deleteKudos.handle({ slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
    expect(operationResponse).toBeInstanceOf(DeleteKudosResponse);
  });

  test("should return a DeleteKudosErrorResponse when trying to delete a kudos", async () => {
    mockedRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    mockedRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(mockedRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse).toBeInstanceOf(DeleteKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_DELETED");
    expect(operationResponse.ok).toBe(false);
  });

  test("should return an error when trying to delete a kudos from another owner", async () => {
    mockedRepository.findBySlug = jest.fn().mockReturnValue(kudos);
    mockedRepository.delete = jest.fn().mockReturnValue(false);

    const deleteKudos = new DeleteKudos(mockedRepository);

    const operationResponse = await deleteKudos.handle({ slug: kudos.slug, userId: "invalid-user-id" });

    expect(operationResponse).toBeInstanceOf(DeleteKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.ok).toBe(false);
  });
});

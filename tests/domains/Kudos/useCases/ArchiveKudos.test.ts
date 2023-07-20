import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import ArchiveKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/ArchiveKudosErrorResponse";

describe("ArchiveKudos", () => {
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

  test("should archive an existing kudos successfully", async () => {
    jest.spyOn(mockedRepository, "findBySlug").mockImplementation(async () => kudos);
    jest.spyOn(mockedRepository, "archive").mockImplementation(async () => true);

    const archivePanel = new ArchiveKudos(mockedRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(true);
  });

  test("should not be able to archive a non existing kudos", async () => {
    jest.spyOn(mockedRepository, "findBySlug").mockImplementation(async () => null);
    const archive = jest.spyOn(mockedRepository, "archive");

    const archivePanel = new ArchiveKudos(mockedRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_FOUND");
    expect(operationResponse.errors[0].message).toBe("You can not archive a kudos that does not exist.");
    expect(archive).not.toHaveBeenCalled();
  });

  it("should return an error if the user is not the kudos's owner", async () => {
    jest.spyOn(mockedRepository, "findBySlug").mockImplementation(async () => kudos);
    const archive = jest.spyOn(mockedRepository, "archive");

    const archivePanel = new ArchiveKudos(mockedRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "invalid-user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchiveKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(operationResponse.errors[0].message).toBe("You can not archive a kudos that is not yours.");
    expect(archive).not.toHaveBeenCalled();
  });

  it("should return an error if the archive action failed", async () => {
    jest.spyOn(mockedRepository, "findBySlug").mockImplementation(async () => kudos);
    jest.spyOn(mockedRepository, "archive").mockImplementation(async () => false);

    const archivePanel = new ArchiveKudos(mockedRepository);

    const operationResponse = await archivePanel.handle({ slug: kudos.slug, userId: "user-id" });

    expect(operationResponse.ok).toBe(false);
    expect(operationResponse).toBeInstanceOf(ArchiveKudosErrorResponse);
    expect(operationResponse.errors[0].status).toBe("KUDOS_NOT_ARCHIVED");
    expect(operationResponse.errors[0].message).toBe("Internal error while archiving the kudos.");
  });
});

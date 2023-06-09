import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import UpdateKudosData from "@/domain/Kudos/DTO/UpdateKudosData";
import UpdateSuccessfulResponse from "@/domain/Kudos/UseCases/Responses/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/Kudos/UseCases/Responses/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";

describe("UpdateKudos", () => {
  let updateKudos: UpdateKudos;
  let mockRepository: KudosRepository;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as KudosRepository;

    updateKudos = new UpdateKudos(mockRepository);
  });

  it("should update an existing kudos", async () => {
    const kudosSlug = "my-kudos";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };
    const updatedKudosData: UpdateKudosData = {
      title: "New Title",
      description: "New Description",
      to: "New Recipient",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockReturnValue(updatedKudosData);

    const result = await updateKudos.handle({ kudosSlug, userId: "owner-id", updateKudosData: updatedKudosData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(kudosSlug);
    expect(mockRepository.update).toHaveBeenCalledWith({
      slug: kudosSlug,
      kudosData: expect.objectContaining({
        title: updatedKudosData.title,
        description: updatedKudosData.description,
        to: updatedKudosData.to,
      }),
    });
    expect(result).toBeInstanceOf(UpdateSuccessfulResponse);
    expect(result.kudos).toEqual(updatedKudosData);
  });

  it("should return an error if title is missing", async () => {
    const kudosSlug = "my-kudos";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const invalidKudosData: UpdateKudosData = {
      title: "",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockReturnValue(invalidKudosData);

    const response = await updateKudos.handle({ kudosSlug, userId: "owner-id", updateKudosData: invalidKudosData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have title");
    expect(response.errors[0].status).toBe("EMPTY_TITLE");
    expect(response.kudos).toBe(null);
  });

  it("should return an error if description is missing", async () => {
    const kudosSlug = "my-kudos";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const invalidKudosData: UpdateKudosData = {
      description: "",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockReturnValue(invalidKudosData);

    const response = await updateKudos.handle({ kudosSlug, userId: "owner-id", updateKudosData: invalidKudosData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have description");
    expect(response.errors[0].status).toBe("EMPTY_DESCRIPTION");
    expect(response.kudos).toBe(null);
  });

  it("should return an error if to is missing", async () => {
    const kudosSlug = "my-kudos";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const invalidKudosData: UpdateKudosData = {
      to: "",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockReturnValue(invalidKudosData);

    const response = await updateKudos.handle({ kudosSlug, userId: "owner-id", updateKudosData: invalidKudosData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have recipient");
    expect(response.errors[0].status).toBe("EMPTY_RECIPIENT");
    expect(response.kudos).toBe(null);
  });

  it("should return an error if the kudos does not exist", async () => {
    const kudosSlug = "non-existent-kudos";
    const updateKudosData: UpdateKudosData = {
      title: "Old Title",
      description: "Old Description",
      to: "Old Recipient",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(undefined);

    const result = await updateKudos.handle({ kudosSlug, userId: "New Owner", updateKudosData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(kudosSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors).toEqual([
      new BusinessError("KUDOS_NOT_FOUND", "Could not found a kudos with the provided ID."),
    ]);
  });

  it("should return an error if the user is not the kudos's owner", async () => {
    const kudosSlug = "my-kudos";

    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const updateKudosData: UpdateKudosData = {
      title: "New Title",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockImplementation(() => null);

    const result = await updateKudos.handle({ kudosSlug, userId: "other-owner", updateKudosData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(kudosSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(result.errors[0].message).toBe("You can not edit a kudos that is not yours.");
  });

  it("should return an error if the response from update do not succeeded", async () => {
    const kudosSlug = "kudos-slug";

    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const updateKudosData: UpdateKudosData = {
      title: "New Title",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    mockRepository.update = jest.fn().mockImplementation(() => null);

    const result = await updateKudos.handle({
      kudosSlug,
      userId: existingKudosData.from.id,
      updateKudosData,
    });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(kudosSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("KUDOS_NOT_UPDATED");
    expect(result.errors[0].message).toBe("Internal error");
  });
});

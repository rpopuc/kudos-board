import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import UpdateKudosData from "@/domain/Kudos/DTO/UpdateKudosData";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import Kudos, { Status } from "@/domain/Kudos/Entities/Kudos";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import Panel from "@/domain/Panel/Entities/Panel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("UpdateKudos", () => {
  let updateKudos: UpdateKudos;
  let mockRepository: KudosRepository;
  let panelRepository: PanelRepository;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
      findByPanelSlug: jest.fn(),
    } as KudosRepository;

    panelRepository = {
      findBySlug: jest.fn(),
    } as Partial<PanelRepository> as PanelRepository;

    updateKudos = new UpdateKudos(mockRepository, panelRepository);
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
      status: Status.ACTIVE,
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
    expect(result.data).toEqual(updatedKudosData);
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
      status: Status.ACTIVE,
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
    expect(response.data).toBe(null);
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
      status: Status.ACTIVE,
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
    expect(response.data).toBe(null);
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
      status: Status.ACTIVE,
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
    expect(response.data).toBe(null);
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
      status: Status.ACTIVE,
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

  it("should be able to update the kudos with panel's owner id", async () => {
    const kudosSlug = "my-kudos";

    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
      status: Status.ACTIVE,
    };

    const updateKudosData: UpdateKudosData = {
      title: "New Title",
    };

    const existingPanel = {
      title: "Old Title",
      owner: "panel-owner",
      password: new PlainTextPassword("oldPassword"),
      updatedAt: currentUpdatedAt,
    } as Partial<Panel> as Panel;

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingKudosData);
    panelRepository.findBySlug = jest.fn().mockReturnValue(existingPanel);
    mockRepository.update = jest.fn().mockImplementation(() => existingKudosData);

    const result = await updateKudos.handle({ kudosSlug, userId: "panel-owner", updateKudosData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(kudosSlug);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(UpdateSuccessfulResponse);
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
      status: Status.ACTIVE,
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

  it("should return an error if kudos is archived", async () => {
    const slug = "my-kudos";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingKudos = {
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      to: "Old Recipient",
      description: "Old Description",
      updatedAt: currentUpdatedAt,
      status: Status.ARCHIVED,
    } as Partial<Kudos> as Kudos;

    const updateKudosData = {
      title: "New Title",
    } as UpdateKudosData;

    jest.spyOn(mockRepository, "findBySlug").mockImplementation(async () => existingKudos);

    const response = await updateKudos.handle({
      kudosSlug: slug,
      userId: "owner-id",
      updateKudosData: updateKudosData,
    });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Its not possible to edit an archived kudos.");
    expect(response.errors[0].status).toBe("INVALID_STATUS");
    expect(response.data).toBe(null);
  });
});

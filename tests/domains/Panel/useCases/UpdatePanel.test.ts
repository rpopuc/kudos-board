import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import PanelData from "@/domain/Panel/DTO/PanelData";
import UpdatePanelData from "@/domain/Panel/DTO/UpdatePanelData";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import Panel, { Status } from "@/domain/Panel/Entities/Panel";

describe("UpdatePanel", () => {
  let updatePanel: UpdatePanel;
  let panelRepository: PanelRepository;

  beforeEach(() => {
    panelRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as PanelRepository;

    updatePanel = new UpdatePanel(panelRepository);
  });

  it("should update an existing panel", async () => {
    const panelSlug = "my-panel";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingPanel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
      updatedAt: currentUpdatedAt,
    } as Partial<Panel> as Panel;

    const updatedPanel = {
      title: "New Title",
      password: new PlainTextPassword("newPassword"),
    } as Partial<Panel> as Panel;

    const updatePanelData = {
      title: "New Title",
      password: new PlainTextPassword("newPassword"),
    } as UpdatePanelData;

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => existingPanel);
    jest.spyOn(panelRepository, "update").mockImplementation(async () => updatedPanel);

    const result = await updatePanel.handle({ panelSlug, userId: "Old Owner", updatePanelData });

    expect(panelRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(panelRepository.update).toHaveBeenCalledWith({
      slug: panelSlug,
      panelData: expect.objectContaining({
        title: updatedPanel.title,
        password: updatedPanel.password,
        owner: existingPanel.owner,
      }),
    });
    expect(result).toBeInstanceOf(UpdateSuccessfulResponse);
    expect(result.data).toEqual(updatePanelData);
  });

  it("should return an error if title is missing", async () => {
    const panelSlug = "my-panel";

    const panel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    } as Partial<Panel> as Panel;

    const invalidPanelData: UpdatePanelData = {
      title: "",
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => panel);

    const response = await updatePanel.handle({
      panelSlug,
      userId: "Old Owner",
      updatePanelData: invalidPanelData,
    });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have title");
    expect(response.errors[0].status).toBe("EMPTY_TITLE");
    expect(response.data).toBe(null);
  });

  it("should return an error if password is missing", async () => {
    const panelSlug = "my-panel";

    const panel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    } as Partial<Panel> as Panel;

    const invalidPanelData: UpdatePanelData = {
      password: new PlainTextPassword(""),
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => panel);

    const response = await updatePanel.handle({
      panelSlug,
      userId: "Old Owner",
      updatePanelData: invalidPanelData,
    });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Invalid password");
    expect(response.errors[0].status).toBe("INVALID_PASSWORD");
    expect(response.data).toBe(null);
  });

  it("should return an error if client password is missing", async () => {
    const panelSlug = "my-panel";

    const panel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    } as Partial<Panel> as Panel;

    const invalidPanelData: UpdatePanelData = {
      clientPassword: new PlainTextPassword(""),
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => panel);

    const response = await updatePanel.handle({
      panelSlug,
      userId: "Old Owner",
      updatePanelData: invalidPanelData,
    });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Invalid client password");
    expect(response.errors[0].status).toBe("INVALID_CLIENT_PASSWORD");
    expect(response.data).toBe(null);
  });

  it("should return an error if the panel does not exist", async () => {
    const panelSlug = "non-existent-panel";
    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => null);

    const result = await updatePanel.handle({
      panelSlug,
      userId: "New Owner",
      updatePanelData: updatedPanelData,
    });

    expect(panelRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors).toEqual([
      new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID."),
    ]);
  });

  it("should return an error if the response from update do not succeeded", async () => {
    const panelSlug = "my-panel";

    const panel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    } as Partial<Panel> as Panel;

    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => panel);
    jest.spyOn(panelRepository, "update").mockImplementation(async () => null);

    const result = await updatePanel.handle({
      panelSlug,
      userId: panel.owner,
      updatePanelData: updatedPanelData,
    });

    expect(panelRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("PANEL_NOT_UPDATED");
    expect(result.errors[0].message).toBe("Internal error");
  });

  it("should return an error if the user is not the panel's owner", async () => {
    const panelSlug = "my-panel";

    const panel = {
      title: "Old Title",
      owner: "Owner",
      password: new PlainTextPassword("oldPassword"),
    } as Partial<Panel> as Panel;

    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => panel);
    jest.spyOn(panelRepository, "update").mockImplementation(async () => null);

    const result = await updatePanel.handle({
      panelSlug,
      userId: "other-owner",
      updatePanelData: updatedPanelData,
    });

    expect(panelRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(result.errors[0].message).toBe("You can not edit a panel that is not yours.");
  });

  it("should return an error if panel is archived", async () => {
    const panelSlug = "my-panel";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingPanel = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
      updatedAt: currentUpdatedAt,
      status: Status.ARCHIVED,
    } as Partial<Panel> as Panel;

    const updatePanelData = {
      title: "New Title",
      password: new PlainTextPassword("newPassword"),
    } as UpdatePanelData;

    jest.spyOn(panelRepository, "findBySlug").mockImplementation(async () => existingPanel);

    const response = await updatePanel.handle({
      panelSlug,
      userId: "Old Owner",
      updatePanelData: updatePanelData,
    });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Its not possible to edit an archived panel.");
    expect(response.errors[0].status).toBe("INVALID_STATUS");
    expect(response.data).toBe(null);
  });
});

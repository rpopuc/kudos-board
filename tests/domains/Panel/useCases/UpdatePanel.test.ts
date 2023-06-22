import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import PanelData from "@/domain/Panel/DTO/PanelData";
import UpdatePanelData from "@/domain/Panel/DTO/UpdatePanelData";
import UpdateSuccessfulResponse from "@/domain/Panel/UseCases/Response/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/Panel/UseCases/Response/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import MockRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("UpdatePanel", () => {
  let updatePanel: UpdatePanel;
  let mockRepository: MockRepository;

  beforeEach(() => {
    mockRepository = new MockRepository();
    updatePanel = new UpdatePanel(mockRepository);
  });

  it("should update an existing panel", async () => {
    const panelSlug = "my-panel";
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
      updatedAt: currentUpdatedAt,
    };
    const updatedPanelData: UpdatePanelData = {
      title: "New Title",
      password: new PlainTextPassword("newPassword"),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockReturnValue(updatedPanelData);

    const result = await updatePanel.handle({ panelSlug, userId: "Old Owner", updatePanelData: updatedPanelData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(mockRepository.update).toHaveBeenCalledWith({
      slug: panelSlug,
      panelData: expect.objectContaining({
        title: updatedPanelData.title,
        password: updatedPanelData.password,
        owner: existingPanelData.owner,
      }),
    });
    expect(result).toBeInstanceOf(UpdateSuccessfulResponse);
    expect(result.panel).toEqual(updatedPanelData);
  });

  it("should return an error if title is missing", async () => {
    const panelSlug = "my-panel";

    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const invalidPanelData: UpdatePanelData = {
      title: "",
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockReturnValue(invalidPanelData);

    const response = await updatePanel.handle({ panelSlug, userId: "Old Owner", updatePanelData: invalidPanelData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have title");
    expect(response.errors[0].status).toBe("EMPTY_TITLE");
    expect(response.panel).toBe(null);
  });

  it("should return an error if password is missing", async () => {
    const panelSlug = "my-panel";

    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const invalidPanelData: UpdatePanelData = {
      title: "Panel title",
      password: new PlainTextPassword(""),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockReturnValue(invalidPanelData);

    const response = await updatePanel.handle({ panelSlug, userId: "Old Owner", updatePanelData: invalidPanelData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Invalid password");
    expect(response.errors[0].status).toBe("INVALID_PASSWORD");
    expect(response.panel).toBe(null);
  });

  it("should return an error if client password is missing", async () => {
    const panelSlug = "my-panel";

    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const invalidPanelData: UpdatePanelData = {
      title: "Panel title",
      clientPassword: new PlainTextPassword(""),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockReturnValue(invalidPanelData);

    const response = await updatePanel.handle({ panelSlug, userId: "Old Owner", updatePanelData: invalidPanelData });

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Invalid client password");
    expect(response.errors[0].status).toBe("INVALID_CLIENT_PASSWORD");
    expect(response.panel).toBe(null);
  });

  it("should return an error if the panel does not exist", async () => {
    const panelSlug = "non-existent-panel";
    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(undefined);

    const result = await updatePanel.handle({ panelSlug, userId: "New Owner", updatePanelData: updatedPanelData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors).toEqual([
      new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID."),
    ]);
  });

  it("should return an error if the response from update do not succeeded", async () => {
    const panelSlug = "my-panel";

    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockImplementation(() => null);

    const result = await updatePanel.handle({
      panelSlug,
      userId: existingPanelData.owner,
      updatePanelData: updatedPanelData,
    });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("PANEL_NOT_UPDATED");
    expect(result.errors[0].message).toBe("Internal error");
  });

  it("should return an error if the user is not the panel's owner", async () => {
    const panelSlug = "my-panel";

    const existingPanelData: PanelData = {
      title: "Old Title",
      owner: "Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const updatedPanelData: PanelData = {
      title: "New Title",
      owner: "New Owner",
      password: new PlainTextPassword("newPassword"),
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(existingPanelData);
    mockRepository.update = jest.fn().mockImplementation(() => null);

    const result = await updatePanel.handle({ panelSlug, userId: "other-owner", updatePanelData: updatedPanelData });

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("NOT_AUTHORIZED");
    expect(result.errors[0].message).toBe("You can not edit a panel that is not yours.");
  });
});

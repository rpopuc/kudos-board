import UpdatePanel from "@/domains/Panel/UseCases/UpdatePanel";
import PanelData from "@/domains/Panel/DTO/PanelData";
import UpdatePanelData from "@/domains/Panel/DTO/UpdatePanelData";
import UpdateSuccessfulResponse from "@/domains/Panel/UseCases/Response/UpdateSuccessfulResponse";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";
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
    mockRepository.update = jest.fn().mockReturnValue(updatedPanelData);

    const result = await updatePanel.handle(panelSlug, updatedPanelData);

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(mockRepository.update).toHaveBeenCalledWith(panelSlug, {
      ...existingPanelData,
      ...updatedPanelData,
    });
    expect(result).toBeInstanceOf(UpdateSuccessfulResponse);
    expect(result.panel).toEqual(updatedPanelData);
  });

  it("should throw an error if title is missing", async () => {
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

    const response = await updatePanel.handle(panelSlug, invalidPanelData);

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Does not have title");
    expect(response.errors[0].status).toBe("EMPTY_TITLE");
    expect(response.panel).toBe(null);
  });

  it("should throw an error if password is missing", async () => {
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

    const response = await updatePanel.handle(panelSlug, invalidPanelData);

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toBe("Invalid password");
    expect(response.errors[0].status).toBe("INVALID_PASSWORD");
    expect(response.panel).toBe(null);
  });

  it("should throw an error if client password is missing", async () => {
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

    const response = await updatePanel.handle(panelSlug, invalidPanelData);

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

    const result = await updatePanel.handle(panelSlug, updatedPanelData);

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors).toEqual([
      new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID."),
    ]);
  });

  it("should throw an error if the response from update do not succeeded", async () => {
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

    const result = await updatePanel.handle(panelSlug, updatedPanelData);

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(panelSlug);
    expect(result).toBeInstanceOf(ErrorResponse);
    expect(result.errors[0].status).toBe("PANEL_NOT_UPDATED");
    expect(result.errors[0].message).toBe("Internal error");
  });
});

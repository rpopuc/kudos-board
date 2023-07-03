import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domain/Panel/UseCases/Response/ShowPanelResponse";
import ShowPanelErrorResponse from "@/domain/Panel/UseCases/Response/ShowPanelErrorResponse";
import Panel from "@/domain/Panel/Entities/Panel";
import Password from "@/domain/shared/valueObjects/Password";

describe("ShowPanel", () => {
  let showPanel: ShowPanel;
  let panelRepository: PanelRepository;

  beforeEach(() => {
    panelRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as PanelRepository;

    showPanel = new ShowPanel(panelRepository);
  });

  test("should return a ShowPanelResponse for an existing panel without client password", async () => {
    const panelSlug = "example-panel";
    const panel = {
      slug: panelSlug,
      clientPassword: undefined,
    } as Partial<Panel> as Panel;

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);

    const response = await showPanel.handle({ panelSlug, clientPassword: "" });

    expect(response instanceof ShowPanelResponse).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.panel).toEqual(panel);
  });

  test("should return a ShowPanelErrorResponse for a non-existing panel", async () => {
    const panelSlug = "non-existing-panel";

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(null);

    const response = await showPanel.handle({ panelSlug, clientPassword: "" });

    expect(response instanceof ShowPanelErrorResponse).toBe(true);
    expect(response.errors[0].message).toBe("Could not found a panel with the provided ID.");
    expect(response.errors[0].status).toBe("PANEL_NOT_FOUND");
  });

  test("should return a ShowPanelResponse for an existing panel with correct client password", async () => {
    const panelSlug = "example-panel";
    const clientPassword = "client-password";
    const panel = {
      slug: panelSlug,
      clientPassword: {
        compare: () => true,
      } as Partial<Password> as Password,
    } as Partial<Panel> as Panel;

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);

    const response = await showPanel.handle({ panelSlug, clientPassword });

    expect(response instanceof ShowPanelResponse).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.panel).toEqual(panel);
  });

  test("should return a ShowPanelErrorResponse for an existing panel with incorrect client password", async () => {
    const panelSlug = "example-panel";
    const clientPassword = "incorrect-password";
    const panel = {
      slug: panelSlug,
      clientPassword: {
        compare: () => false,
      } as Partial<Password> as Password,
    } as Partial<Panel> as Panel;

    jest.spyOn(panelRepository, "findBySlug").mockReturnValue(panel);

    const response = await showPanel.handle({ panelSlug, clientPassword });

    expect(response instanceof ShowPanelErrorResponse).toBe(true);
    expect(response.errors[0].message).toBe("You can not access this panel.");
    expect(response.errors[0].status).toBe("NOT_AUTHORIZED");
  });
});

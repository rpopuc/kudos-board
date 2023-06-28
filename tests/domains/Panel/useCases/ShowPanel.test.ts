import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domain/Panel/UseCases/Response/ShowPanelResponse";
import ShowPanelErrorResponse from "@/domain/Panel/UseCases/Response/ShowPanelErrorResponse";

describe("ShowPanel", () => {
  let showPanel: ShowPanel;
  let mockRepository: PanelRepository;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as PanelRepository;

    showPanel = new ShowPanel(mockRepository);
  });

  test("should return a ShowPanelResponse for an existing panel without client password", async () => {
    const panelSlug = "example-panel";
    const panel = {
      slug: panelSlug,
      clientPassword: undefined,
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(panel);

    const response = await showPanel.handle({ panelSlug, clientPassword: "" });

    expect(response instanceof ShowPanelResponse).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.panel).toEqual(panel);
  });

  test("should return a ShowPanelErrorResponse for a non-existing panel", async () => {
    const panelSlug = "non-existing-panel";

    mockRepository.findBySlug = jest.fn().mockReturnValue(null);

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
      },
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(panel);

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
      },
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(panel);

    const response = await showPanel.handle({ panelSlug, clientPassword });

    expect(response instanceof ShowPanelErrorResponse).toBe(true);
    expect(response.errors[0].message).toBe("You can not access this panel.");
    expect(response.errors[0].status).toBe("NOT_AUTHORIZED");
  });
});

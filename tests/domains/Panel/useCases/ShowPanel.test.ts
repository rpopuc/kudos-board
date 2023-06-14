import ShowPanel from "@/domains/Panel/UseCases/ShowPanel";
import PanelRepository from "@/domains/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domains/Panel/UseCases/Response/ShowPanelResponse";
import ShowPanelErrorResponse from "@/domains/Panel/UseCases/Response/ShowPanelErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domains/Panel/DTO/PanelData";

describe("ShowPanel", () => {
  let showPanel: ShowPanel;
  let mockRepository: PanelRepository;

  beforeEach(() => {
    const panelData = {
      title: "Example Title",
      owner: "1",
      password: new PlainTextPassword("teste12345"),
    } as PanelData;

    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockReturnValue(true),
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

    const response = await showPanel.handle(panelSlug, "");

    expect(response instanceof ShowPanelResponse).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.panel).toEqual(panel);
  });

  test("should return a ShowPanelErrorResponse for a non-existing panel", async () => {
    const panelSlug = "non-existing-panel";

    mockRepository.findBySlug = jest.fn().mockReturnValue(null);

    const response = await showPanel.handle(panelSlug, "");

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

    const response = await showPanel.handle(panelSlug, clientPassword);

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

    const response = await showPanel.handle(panelSlug, clientPassword);

    expect(response instanceof ShowPanelErrorResponse).toBe(true);
    expect(response.errors[0].message).toBe("You can not access this panel.");
    expect(response.errors[0].status).toBe("NOT_AUTHORIZED");
  });
});

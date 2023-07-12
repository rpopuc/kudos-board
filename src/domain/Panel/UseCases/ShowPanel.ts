import Repository from "@/domain/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domain/Panel/UseCases/Response/ShowPanelResponse";
import ShowPanelErrorResponse from "@/domain/Panel/UseCases/Response/ShowPanelErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

export type ShowPanelData = {
  panelSlug: string;
  clientPassword: string;
};

class ShowPanel {
  constructor(private repository: Repository) {}

  async handle({ panelSlug, clientPassword }: ShowPanelData): Promise<ShowPanelResponse> {
    const panel = await this.repository.findBySlug(panelSlug);

    if (!panel) {
      return new ShowPanelErrorResponse([
        new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID."),
      ]);
    }

    if (!panel.clientPassword) {
      return new ShowPanelResponse(true, panel);
    }

    if (!panel.clientPassword.compare(clientPassword)) {
      return new ShowPanelErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not access this panel.")]);
    }

    return new ShowPanelResponse(true, panel);
  }
}

export default ShowPanel;

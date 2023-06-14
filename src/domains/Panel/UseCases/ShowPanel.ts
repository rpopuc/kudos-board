import Repository from "@/domains/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domains/Panel/UseCases/Response/ShowPanelResponse";
import ShowPanelErrorResponse from "@/domains/Panel/UseCases/Response/ShowPanelErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class ShowPanel {
  constructor(private repository: Repository) {}

  async handle(panelSlug: string, clientPassword: string): Promise<ShowPanelResponse> {
    const panel = this.repository.findBySlug(panelSlug);

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

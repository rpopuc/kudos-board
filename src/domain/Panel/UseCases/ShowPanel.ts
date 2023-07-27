import Repository from "@/domain/Panel/Repositories/PanelRepository";
import ShowPanelResponse from "@/domain/shared/Responses/ShowDataResponse";
import ShowPanelErrorResponse from "@/domain/shared/Responses/ShowErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import Panel from "@/domain/Panel/Entities/Panel";

export type ShowPanelData = {
  panelSlug: string;
  clientPassword: string;
};

class ShowPanel {
  constructor(private repository: Repository) {}

  async handle({ panelSlug, clientPassword }: ShowPanelData): Promise<ShowPanelResponse<Panel>> {
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

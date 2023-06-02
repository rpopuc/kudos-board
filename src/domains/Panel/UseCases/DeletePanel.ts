import Repository from "@/domains/Panel/Repositories/PanelRepository";
import DeletePanelResponse from "@/domains/Panel/UseCases/Response/DeletePanelResponse";
import DeletePanelErrorResponse from "@/domains/Panel/UseCases/Response/DeletePanelErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class DeletePanel {
  constructor(private repository: Repository) {}

  async handle(panelSlug: string): Promise<DeletePanelResponse> {
    const deletedPanel = this.repository.delete(panelSlug);

    if (!deletedPanel) {
      return new DeletePanelErrorResponse([
        new BusinessError("PANEL_NOT_DELETED", "Internal error while deleting the panel."),
      ]);
    }

    return new DeletePanelResponse(deletedPanel);
  }
}

export default DeletePanel;

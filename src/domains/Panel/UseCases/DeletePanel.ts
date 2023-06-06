import Repository from "@/domains/Panel/Repositories/PanelRepository";
import DeletePanelResponse from "@/domains/Panel/UseCases/Response/DeletePanelResponse";
import DeletePanelErrorResponse from "@/domains/Panel/UseCases/Response/DeletePanelErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class DeletePanel {
  constructor(private repository: Repository) {}

  async handle(panelSlug: string, userId: string): Promise<DeletePanelResponse> {
    const panel = this.repository.findBySlug(panelSlug);

    if (!panel) {
      return new DeletePanelResponse(true);
    }

    if (userId !== panel.owner) {
      return new DeletePanelErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not delete a panel that is not yours."),
      ]);
    }

    const operationResult = this.repository.delete(panelSlug);

    if (!operationResult) {
      return new DeletePanelErrorResponse([
        new BusinessError("PANEL_NOT_DELETED", "Internal error while deleting the panel."),
      ]);
    }

    return new DeletePanelResponse(operationResult);
  }
}

export default DeletePanel;

import Repository from "@/domain/Panel/Repositories/PanelRepository";
import DeletePanelResponse from "@/domain/shared/Responses/DeleteDataResponse";
import DeletePanelErrorResponse from "@/domain/shared/Responses/DeleteErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

export type DeletePanelData = {
  panelSlug: string;
  userId: string;
};

class DeletePanel {
  constructor(private repository: Repository) {}

  async handle({ panelSlug, userId }: DeletePanelData): Promise<DeletePanelResponse> {
    const panel = await this.repository.findBySlug(panelSlug);

    if (!panel) {
      return new DeletePanelResponse(true);
    }

    if (userId !== panel.owner) {
      return new DeletePanelErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not delete a panel that is not yours."),
      ]);
    }

    const operationResult = await this.repository.delete(panelSlug);

    if (!operationResult) {
      return new DeletePanelErrorResponse([
        new BusinessError("PANEL_NOT_DELETED", "Internal error while deleting the panel."),
      ]);
    }

    return new DeletePanelResponse(operationResult);
  }
}

export default DeletePanel;

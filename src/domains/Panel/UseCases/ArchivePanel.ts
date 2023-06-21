import Repository from "@/domains/Panel/Repositories/PanelRepository";

import ArchivePanelResponse from "@/domains/Panel/UseCases/Response/ArchivePanelResponse";
import ArchivePanelErrorResponse from "@/domains/Panel/UseCases/Response/ArchivePanelErrorResponse";

import BusinessError from "@/domains/shared/errors/BusinessError";

class ArchivePanel {
  constructor(private repository: Repository) {}

  async handle(panelSlug: string, userId: string): Promise<ArchivePanelResponse> {
    const panel = this.repository.findBySlug(panelSlug);

    if (!panel) {
      return new ArchivePanelErrorResponse([
        new BusinessError("NOT_FOUND", "You can not archive a panel that does not exist."),
      ]);
    }

    if (userId !== panel.owner) {
      return new ArchivePanelErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not archive a panel that is not yours."),
      ]);
    }

    const operationResult = this.repository.archive(panelSlug);

    if (!operationResult) {
      return new ArchivePanelErrorResponse([
        new BusinessError("PANEL_NOT_ARCHIVED", "Internal error while archiving the panel."),
      ]);
    }

    return new ArchivePanelResponse(operationResult);
  }
}

export default ArchivePanel;

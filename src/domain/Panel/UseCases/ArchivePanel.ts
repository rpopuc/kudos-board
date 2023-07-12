import Repository from "@/domain/Panel/Repositories/PanelRepository";

import ArchivePanelResponse from "@/domain/Panel/UseCases/Response/ArchivePanelResponse";
import ArchivePanelErrorResponse from "@/domain/Panel/UseCases/Response/ArchivePanelErrorResponse";

import BusinessError from "@/domain/shared/errors/BusinessError";

export type ArchivePanelData = {
  panelSlug: string;
  userId: string;
};

class ArchivePanel {
  constructor(private repository: Repository) {}

  async handle({ panelSlug, userId }: ArchivePanelData): Promise<ArchivePanelResponse> {
    const panel = await this.repository.findBySlug(panelSlug);

    if (!panel) {
      return new ArchivePanelErrorResponse([
        new BusinessError("PANEL_NOT_FOUND", "You can not archive a panel that does not exist."),
      ]);
    }

    if (userId !== panel.owner) {
      return new ArchivePanelErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not archive a panel that is not yours."),
      ]);
    }

    const operationResult = await this.repository.archive(panelSlug);

    if (!operationResult) {
      return new ArchivePanelErrorResponse([
        new BusinessError("PANEL_NOT_ARCHIVED", "Internal error while archiving the panel."),
      ]);
    }

    return new ArchivePanelResponse(operationResult);
  }
}

export default ArchivePanel;

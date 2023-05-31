import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";
import EmptyData from "@/domains/shared/errors/EmptyData";
import ValidationResponse from "@/domains/shared/ValidationResponse";
import UpdatePanelResponse from "@/domains/Panel/UseCases/Response/UpdatePanelResponse";
import UpdateSuccessfulResponse from "@/domains/Panel/UseCases/Response/UpdateSuccessfulResponse";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class UpdatePanel {
  constructor(private repository: Repository) {}

  validate(panelData: PanelData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!panelData.title) {
      result.addError(new EmptyData("EMPTY_TITLE", "title"));
    }

    if (!panelData.owner) {
      result.addError(new EmptyData("EMPTY_OWNER", "owner"));
    }

    if (!panelData.password.isValid()) {
      result.addError(new EmptyData("EMPTY_PASSWORD", "password"));
    }

    return result;
  }

  async handle(panelSlug: string, panelData: PanelData): Promise<UpdatePanelResponse> {
    const existingPanel = this.repository.findBySlug(panelSlug);

    if (!existingPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID.")]);
    }

    const updatedPanelData = {
      ...existingPanel,
      ...panelData,
    } as PanelData;

    const validation = this.validate(updatedPanelData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const updatedPanel = this.repository.update(panelSlug, updatedPanelData);

    if (!updatedPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_UPDATED", "Internal error")]);
    }

    return new UpdateSuccessfulResponse(updatedPanel);
  }
}

export default UpdatePanel;

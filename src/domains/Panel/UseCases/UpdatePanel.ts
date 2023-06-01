import Repository from "@/domains/Panel/Repositories/PanelRepository";
import UpdatePanelData from "@/domains/Panel/DTO/UpdatePanelData";
import PanelData from "@/domains/Panel/DTO/PanelData";
import EmptyData from "@/domains/shared/errors/EmptyData";
import ValidationResponse from "@/domains/shared/ValidationResponse";
import UpdatePanelResponse from "@/domains/Panel/UseCases/Response/UpdatePanelResponse";
import UpdateSuccessfulResponse from "@/domains/Panel/UseCases/Response/UpdateSuccessfulResponse";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";
import InvalidPassword from "@/domains/shared/errors/InvalidPassword";

class UpdatePanel {
  constructor(private repository: Repository) {}

  validate(updatePanelData: UpdatePanelData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!updatePanelData.title) {
      result.addError(new EmptyData("EMPTY_TITLE", "title"));
    }

    if (updatePanelData.password && !updatePanelData.password.isValid()) {
      result.addError(new InvalidPassword("password"));
    }

    if (updatePanelData.clientPassword && !updatePanelData.clientPassword.isValid()) {
      result.addError(new InvalidPassword("clientPassword", "Invalid client password", "INVALID_CLIENT_PASSWORD"));
    }

    return result;
  }

  async handle(panelSlug: string, updatePanelData: UpdatePanelData): Promise<UpdatePanelResponse> {
    const existingPanel = this.repository.findBySlug(panelSlug);

    if (!existingPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID.")]);
    }

    const validation = this.validate(updatePanelData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const updatedPanelData = {
      ...existingPanel,
      ...updatePanelData,
    } as PanelData;

    const updatedPanel = this.repository.update(panelSlug, updatedPanelData);

    if (!updatedPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_UPDATED", "Internal error")]);
    }

    return new UpdateSuccessfulResponse(updatedPanel);
  }
}

export default UpdatePanel;

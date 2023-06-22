import Repository from "@/domain/Panel/Repositories/PanelRepository";
import UpdatePanelData from "@/domain/Panel/DTO/UpdatePanelData";
import PanelData from "@/domain/Panel/DTO/PanelData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import UpdatePanelResponse from "@/domain/Panel/UseCases/Response/UpdatePanelResponse";
import UpdateSuccessfulResponse from "@/domain/Panel/UseCases/Response/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/Panel/UseCases/Response/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import InvalidPassword from "@/domain/shared/errors/InvalidPassword";

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

  async handle(panelSlug: string, userId: string, updatePanelData: UpdatePanelData): Promise<UpdatePanelResponse> {
    const existingPanel = this.repository.findBySlug(panelSlug);

    if (!existingPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID.")]);
    }

    if (existingPanel.owner !== userId) {
      return new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not edit a panel that is not yours.")]);
    }

    const validation = this.validate(updatePanelData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const updatedPanelData = {
      ...existingPanel,
      ...updatePanelData,
      ...{
        updatedAt: new Date(),
      },
    } as PanelData;

    const updatedPanel = this.repository.update(panelSlug, updatedPanelData);

    if (!updatedPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_UPDATED", "Internal error")]);
    }

    return new UpdateSuccessfulResponse(updatedPanel);
  }
}

export default UpdatePanel;

import Repository from "@/domain/Panel/Repositories/PanelRepository";
import UpdatePanelData from "@/domain/Panel/DTO/UpdatePanelData";
import PanelData from "@/domain/Panel/DTO/PanelData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import UpdatePanelResponse from "@/domain/shared/Responses/UpdateDataResponse";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import InvalidPassword from "@/domain/shared/errors/InvalidPassword";
import Panel, { Status } from "@/domain/Panel/Entities/Panel";
import InvalidStatus from "@/domain/shared/errors/InvalidStatus";

export type UpdatePanelRequest = {
  panelSlug: string;
  userId: string;
  updatePanelData: UpdatePanelData;
};

class UpdatePanel {
  constructor(private repository: Repository) {}

  validate(updatePanelData: PanelData): ValidationResponse {
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

    if (updatePanelData.status === Status.ARCHIVED) {
      result.addError(new InvalidStatus("Its not possible to edit an archived panel."));
    }

    return result;
  }

  async handle({ panelSlug, userId, updatePanelData }: UpdatePanelRequest): Promise<UpdatePanelResponse<Panel>> {
    const existingPanel = await this.repository.findBySlug(panelSlug);

    if (!existingPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID.")]);
    }

    if (existingPanel.owner !== userId) {
      return new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not edit a panel that is not yours.")]);
    }

    const updatedPanelData = {
      ...existingPanel,
      ...updatePanelData,
      ...{
        updatedAt: new Date(),
      },
    } as PanelData;

    const validation = this.validate(updatedPanelData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const updatedPanel = await this.repository.update({ slug: panelSlug, panelData: updatedPanelData });

    if (!updatedPanel) {
      return new ErrorResponse([new BusinessError("PANEL_NOT_UPDATED", "Internal error")]);
    }

    return new UpdateSuccessfulResponse(updatedPanel);
  }
}

export default UpdatePanel;

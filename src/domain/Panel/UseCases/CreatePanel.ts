import Repository from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import CreatePanelResponse from "@/domain/Panel/UseCases/Response/CreatePanelResponse";
import SuccessfulResponse from "@/domain/Panel/UseCases/Response/SuccessfulResponse";
import ErrorResponse from "@/domain/Panel/UseCases/Response/ErrorResponse";

class CreatePanel {
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

  async handle(panelData: PanelData): Promise<CreatePanelResponse> {
    const validation = this.validate(panelData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const now = new Date();

    const newPanel = await this.repository.create({
      ...panelData,
      createdAt: now,
      updatedAt: now,
    });

    return new SuccessfulResponse(newPanel);
  }
}

export default CreatePanel;

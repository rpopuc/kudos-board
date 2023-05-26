import Repository from "@/domains/Panel/Repositories/PanelRepository";
import PanelData from "@/domains/Panel/DTO/PanelData";
import EmptyData from "@/domains/shared/errors/EmptyData";
import ValidationResponse from "@/domains/shared/ValidationResponse";
import CreatePanelResponse from "@/domains/Panel/UseCases/Response/CreatePanelResponse";
import SuccessfulResponse from "@/domains/Panel/UseCases/Response/SuccessfulResponse";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";

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

    const newPanel = this.repository.create({
      ...panelData,
      createdAt: new Date(),
    });

    return new SuccessfulResponse(newPanel);
  }
}

export default CreatePanel;

import Repository from "@/domain/Panel/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import CreatePanelResponse from "@/domain/shared/Responses/CreateDataResponse";
import SuccessfulResponse from "@/domain/shared/Responses/SuccessfulResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import Password from "@/domain/shared/valueObjects/Password";
import Panel from "../Entities/Panel";

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

    if (!this.isClientPasswordValid(panelData.clientPassword)) {
      result.addError(new EmptyData("EMPTY_PASSWORD", "clientPassword"));
    }

    return result;
  }

  isClientPasswordValid(clientPassword: Password | undefined): boolean {
    return clientPassword === undefined || clientPassword.getValue() === "" || clientPassword.isValid();
  }

  async handle(panelData: PanelData): Promise<CreatePanelResponse<Panel>> {
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

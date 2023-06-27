import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import CreateKudosResponse from "@/domain/Kudos/UseCases/Responses/CreateKudosResponse";
import SuccessfulResponse from "@/domain/Kudos/UseCases/Responses/SuccessfulResponse";
import ErrorResponse from "@/domain/Kudos/UseCases/Responses/ErrorResponse";

class CreateKudos {
  constructor(private repository: Repository) {}

  validate(kudosData: KudosData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!kudosData.title) {
      result.addError(new EmptyData("EMPTY_TITLE", "title"));
    }

    if (!kudosData.description) {
      result.addError(new EmptyData("EMPTY_DESCRIPTION", "description"));
    }

    if (!kudosData.from.name || !kudosData.from.id) {
      result.addError(new EmptyData("EMPTY_OWNER", "owner"));
    }

    if (!kudosData.to) {
      result.addError(new EmptyData("EMPTY_RECIPIENT", "recipient"));
    }

    if (!kudosData.panelSlug) {
      result.addError(new EmptyData("EMPTY_PANEL_SLUG", "panel slug"));
    }

    return result;
  }

  async handle(kudosData: KudosData): Promise<CreateKudosResponse> {
    const validation = this.validate(kudosData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const newKudos = this.repository.create({
      ...kudosData,
      createdAt: new Date(),
    });

    return new SuccessfulResponse(newKudos);
  }
}

export default CreateKudos;

import ArchiveKudosResponse from "@/domain/Kudos/UseCases/Responses/ArchiveKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ArchiveKudosErrorResponse extends ArchiveKudosResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default ArchiveKudosErrorResponse;

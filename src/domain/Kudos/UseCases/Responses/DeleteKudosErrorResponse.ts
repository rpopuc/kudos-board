import DeleteKudosResponse from "@/domain/Kudos/UseCases/Responses/DeleteKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class DeleteKudosErrorResponse extends DeleteKudosResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default DeleteKudosErrorResponse;

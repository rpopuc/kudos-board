import BusinessError from "@/domain/shared/errors/BusinessError";
import DeleteDataResponse from "./DeleteDataResponse";

class DeleteErrorResponse extends DeleteDataResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default DeleteErrorResponse;

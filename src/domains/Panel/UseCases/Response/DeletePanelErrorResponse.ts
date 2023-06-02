import DeletePanelResponse from "@/domains/Panel/UseCases/Response/DeletePanelResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class DeletePanelErrorResponse extends DeletePanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default DeletePanelErrorResponse;

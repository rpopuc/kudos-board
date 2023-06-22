import CreatePanelResponse from "@/domain/Panel/UseCases/Response/CreatePanelResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ErrorResponse extends CreatePanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ErrorResponse;

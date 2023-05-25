import CreatePanelResponse from "@/domains/Panel/UseCases/Response/CreatePanelResponse";
import BusinessError from "@/domains/shared/exceptions/BusinessError";

class ErrorResponse extends CreatePanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ErrorResponse;

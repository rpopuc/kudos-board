import CreatePanelResponse from "@/domains/Panel/UseCases/Response/CreatePanelResponse";
import Error from "@/domains/shared/exceptions/Error";

class ErrorResponse extends CreatePanelResponse {
  constructor(errors: Error[]) {
    super(false, null, errors);
  }
}

export default ErrorResponse;

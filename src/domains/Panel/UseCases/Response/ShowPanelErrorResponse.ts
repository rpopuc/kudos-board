import ShowPanelResponse from "@/domains/Panel/UseCases/Response/ShowPanelResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class ShowPanelErrorResponse extends ShowPanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ShowPanelErrorResponse;

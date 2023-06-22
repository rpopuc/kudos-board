import ShowPanelResponse from "@/domain/Panel/UseCases/Response/ShowPanelResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ShowPanelErrorResponse extends ShowPanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ShowPanelErrorResponse;

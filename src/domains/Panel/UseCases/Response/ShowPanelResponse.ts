import BusinessError from "@/domains/shared/errors/BusinessError";
import Panel from "../../Entities/Panel";

class ShowPanelResponse {
  constructor(public ok: boolean = true, public panel: Panel | null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ShowPanelResponse;

import BusinessError from "@/domain/shared/errors/BusinessError";
import Panel from "@/domain/Panel/Entities/Panel";

class ShowPanelResponse {
  constructor(public ok: boolean = true, public panel: Panel | null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ShowPanelResponse;

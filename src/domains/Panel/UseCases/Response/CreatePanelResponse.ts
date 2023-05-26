import BusinessError from "@/domains/shared/errors/BusinessError";
import PanelEntity from "@/domains/Panel/Entities/Panel";

class CreatePanelResponse {
  constructor(public ok: boolean, public panel: PanelEntity | null = null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default CreatePanelResponse;

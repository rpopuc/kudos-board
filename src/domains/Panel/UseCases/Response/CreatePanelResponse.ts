import Error from "@/domains/shared/exceptions/Error";
import PanelEntity from "@/domains/Panel/Entities/Panel";

class CreatePanelResponse {
  constructor(public ok: boolean, public panel: PanelEntity | null = null, public errors: Error[] = []) {}

  addError(error: Error) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default CreatePanelResponse;

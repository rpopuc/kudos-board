import BusinessError from "@/domain/shared/errors/BusinessError";
import PanelEntity from "@/domain/Panel/Entities/Panel";

class UpdatePanelResponse {
  constructor(public ok: boolean, public panel: PanelEntity | null = null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default UpdatePanelResponse;

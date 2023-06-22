import UpdatePanelResponse from "@/domain/Panel/UseCases/Response/UpdatePanelResponse";
import PanelEntity from "@/domain/Panel/Entities/Panel";

class UpdateSuccessfulResponse extends UpdatePanelResponse {
  constructor(panel: PanelEntity) {
    super(true, panel);
  }
}

export default UpdateSuccessfulResponse;

import UpdatePanelResponse from "@/domains/Panel/UseCases/Response/UpdatePanelResponse";
import PanelEntity from "@/domains/Panel/Entities/Panel";

class UpdateSuccessfulResponse extends UpdatePanelResponse {
  constructor(panel: PanelEntity) {
    super(true, panel);
  }
}

export default UpdateSuccessfulResponse;

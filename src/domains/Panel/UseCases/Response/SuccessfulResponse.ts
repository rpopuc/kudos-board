import CreatePanelResponse from "@/domains/Panel/UseCases/Response/CreatePanelResponse";
import PanelEntity from "@/domains/Panel/Entities/Panel";

class SuccessfulResponse extends CreatePanelResponse {
  constructor(panel: PanelEntity) {
    super(true, panel);
  }
}

export default SuccessfulResponse;

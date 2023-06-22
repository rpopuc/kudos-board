import CreatePanelResponse from "@/domain/Panel/UseCases/Response/CreatePanelResponse";
import PanelEntity from "@/domain/Panel/Entities/Panel";

class SuccessfulResponse extends CreatePanelResponse {
  constructor(panel: PanelEntity) {
    super(true, panel);
  }
}

export default SuccessfulResponse;

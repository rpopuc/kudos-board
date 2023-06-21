import ArchivePanelResponse from "@/domains/Panel/UseCases/Response/ArchivePanelResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";

class ArchivePanelErrorResponse extends ArchivePanelResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default ArchivePanelErrorResponse;

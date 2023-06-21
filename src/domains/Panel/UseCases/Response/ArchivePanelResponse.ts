import BusinessError from "@/domains/shared/errors/BusinessError";

class ArchivePanelResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ArchivePanelResponse;

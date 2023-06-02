import BusinessError from "@/domains/shared/errors/BusinessError";

class DeletePanelResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default DeletePanelResponse;

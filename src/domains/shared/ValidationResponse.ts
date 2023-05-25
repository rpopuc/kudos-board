import BusinessError from "@/domains/shared/exceptions/BusinessError";

class ValidationResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ValidationResponse;

import Error from "@/domains/shared/exceptions/Error";

class ValidationResponse {
  constructor(public ok: boolean, public errors: Error[] = []) {}

  addError(error: Error) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ValidationResponse;

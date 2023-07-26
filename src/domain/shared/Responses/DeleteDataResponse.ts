import BusinessError from "@/domain/shared/errors/BusinessError";

class DeleteDataResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default DeleteDataResponse;

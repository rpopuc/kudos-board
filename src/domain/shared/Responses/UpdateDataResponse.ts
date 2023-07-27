import BusinessError from "@/domain/shared/errors/BusinessError";

class UpdateDataResponse<T> {
  constructor(public ok: boolean, public data: T | null = null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default UpdateDataResponse;

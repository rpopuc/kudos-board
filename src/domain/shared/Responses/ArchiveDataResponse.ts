import BusinessError from "@/domain/shared/errors/BusinessError";

class ArchiveDataResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ArchiveDataResponse;

import BusinessError from "@/domain/shared/errors/BusinessError";

class ArchiveKudosResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ArchiveKudosResponse;

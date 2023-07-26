import BusinessError from "@/domain/shared/errors/BusinessError";
import ArchiveDataResponse from "./ArchiveDataResponse";

class ArchiveErrorResponse extends ArchiveDataResponse {
  constructor(errors: BusinessError[]) {
    super(false, []);

    errors.forEach(error => this.addError(error));
  }
}

export default ArchiveErrorResponse;

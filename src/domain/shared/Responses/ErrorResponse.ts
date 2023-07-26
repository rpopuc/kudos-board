import CreateDataResponse from "@/domain/shared/Responses/CreateDataResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ErrorResponse<T> extends CreateDataResponse<T> {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ErrorResponse;

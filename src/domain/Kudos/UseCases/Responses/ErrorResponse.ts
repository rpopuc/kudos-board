import CreateKudosResponse from "@/domain/Kudos/UseCases/Responses/CreateKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ErrorResponse extends CreateKudosResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ErrorResponse;

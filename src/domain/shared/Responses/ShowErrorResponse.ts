import BusinessError from "@/domain/shared/errors/BusinessError";
import ShowDataResponse from "./ShowDataResponse";

class ShowErrorResponse<T> extends ShowDataResponse<T> {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ShowErrorResponse;

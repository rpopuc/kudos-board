import ShowKudosResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

class ShowKudosErrorResponse extends ShowKudosResponse {
  constructor(errors: BusinessError[]) {
    super(false, null, errors);
  }
}

export default ShowKudosErrorResponse;

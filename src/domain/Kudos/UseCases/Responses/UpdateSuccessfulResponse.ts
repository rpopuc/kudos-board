import UpdateKudosResponse from "@/domain/Kudos/UseCases/Responses/UpdateKudosResponse";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";

class UpdateSuccessfulResponse extends UpdateKudosResponse {
  constructor(kudos: KudosEntity) {
    super(true, kudos);
  }
}

export default UpdateSuccessfulResponse;

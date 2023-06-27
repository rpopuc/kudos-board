import CreateKudosResponse from "@/domain/Kudos/UseCases/Responses/CreateKudosResponse";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";

class SuccessfulResponse extends CreateKudosResponse {
  constructor(kudos: KudosEntity) {
    super(true, kudos);
  }
}

export default SuccessfulResponse;

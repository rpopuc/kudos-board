import CreateKudosResponse from "@/domain/Kudos/UseCases/Responses/CreateKudosResponse";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";

class SuccessfulResponse extends CreateKudosResponse {
  constructor(panel: KudosEntity) {
    super(true, panel);
  }
}

export default SuccessfulResponse;

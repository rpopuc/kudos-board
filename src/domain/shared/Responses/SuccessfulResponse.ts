import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import CreateDataResponse from "./CreateDataResponse";

class SuccessfulResponse<T> extends CreateDataResponse<T> {
  constructor(data: T) {
    super(true, data);
  }
}

export default SuccessfulResponse;

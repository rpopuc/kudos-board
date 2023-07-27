import UpdateDataResponse from "./UpdateDataResponse";

class UpdateSuccessfulResponse<T> extends UpdateDataResponse<T> {
  constructor(data: T) {
    super(true, data);
  }
}

export default UpdateSuccessfulResponse;

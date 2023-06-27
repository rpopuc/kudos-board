import BusinessError from "@/domain/shared/errors/BusinessError";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";

class CreateKudosResponse {
  constructor(public ok: boolean, public kudos: KudosEntity | null = null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default CreateKudosResponse;

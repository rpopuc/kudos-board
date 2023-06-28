import BusinessError from "@/domain/shared/errors/BusinessError";
import Kudos from "@/domain/Kudos/Entities/Kudos";

class ShowKudosResponse {
  constructor(public ok: boolean = true, public kudos: Kudos | null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ShowKudosResponse;

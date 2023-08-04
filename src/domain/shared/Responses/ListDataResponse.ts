import BusinessError from "@/domain/shared/errors/BusinessError";

class ListDataResponse<T> {
  constructor(public ok: boolean = true, public data: T[] | null, public errors: BusinessError[] = []) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default ListDataResponse;

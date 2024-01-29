import BusinessError from "@/domain/shared/errors/BusinessError";

class EmptyData extends BusinessError {
  constructor(status: string, dataName: string, message: string | undefined = undefined) {
    super(status, message ? message : `Does not have ${dataName}`);
  }
}

export default EmptyData;

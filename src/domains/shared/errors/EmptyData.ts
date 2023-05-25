import BusinessError from "@/domains/shared/errors/BusinessError";

class EmptyData extends BusinessError {
  constructor(status: string, dataName: string, message: string | null = null) {
    super(status, message ? message : `Does not have ${dataName}`);
  }
}

export default EmptyData;

import BusinessError from "@/domain/shared/errors/BusinessError";

class InvalidStatus extends BusinessError {
  constructor(message: string) {
    super("INVALID_STATUS", message);
  }
}

export default InvalidStatus;

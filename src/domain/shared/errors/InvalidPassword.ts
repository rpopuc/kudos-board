import BusinessError from "@/domain/shared/errors/BusinessError";

class InvalidPassword extends BusinessError {
  constructor(fieldName: string, message: string | null = null, status: string = "INVALID_PASSWORD") {
    super(status, message ? message : `Invalid password`);
  }
}

export default InvalidPassword;

import BusinessError from "@/domain/shared/errors/BusinessError";

class LoginResponse {
  constructor(public ok: boolean, public errors: BusinessError[] = [], public token?: string) {}

  addError(error: BusinessError) {
    this.errors.push(error);
    this.ok = false;
  }
}

export default LoginResponse;

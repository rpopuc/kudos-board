import { injectable, inject } from "inversify";
import UserRepository, { UserRepositoryType } from "@/domain/User/Repositories/UserRepository";
import LoginResponse from "@/domain/Auth/UseCases/Responses/LoginReponse";
import LoginData from "@/domain/Auth/DTO/LoginData";

@injectable()
class Login {
  constructor(@inject(UserRepositoryType) private userRepository: UserRepository) {}

  async handle(loginData: LoginData): Promise<LoginResponse> {
    return new LoginResponse(true);
  }
}

export default Login;

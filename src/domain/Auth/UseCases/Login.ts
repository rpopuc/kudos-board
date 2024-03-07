import { injectable, inject } from "inversify";
import UserRepository, { UserRepositoryType } from "@/domain/User/Repositories/UserRepository";
import JWTService, { JWTServiceType } from "@/domain/Services/JWTService";
import LoginResponse from "@/domain/Auth/UseCases/Responses/LoginReponse";
import LoginData from "@/domain/Auth/DTO/LoginData";
import BusinessError from "@/domain/shared/errors/BusinessError";

@injectable()
class Login {
  constructor(
    @inject(UserRepositoryType) private userRepository: UserRepository,
    @inject(JWTServiceType) private jwtService: JWTService
  ) {}

  async handle(loginData: LoginData): Promise<LoginResponse> {
    const user = await this.userRepository.find(loginData.email);

    if (user === null) {
      return new LoginResponse(false, [
        new BusinessError('invalid-credentials', 'Invalid credentials')
      ]);
    }

    // TODO: Verificar o motivo da senha estar falhando
    if (!user.password.compare(loginData.password.getValue())) {
      return new LoginResponse(false, [
        new BusinessError('invalid-credentials', 'Invalid password')
      ]);
    }

    const token = await this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: 'admin'
    }, 3600);

    return new LoginResponse(true, [], token);
  }
}

export default Login;

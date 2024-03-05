import { injectable, inject } from "inversify";
import UserData from "@/domain/User/DTO/UserData";
import UserRepository, { UserRepositoryType } from "@/domain/User/Repositories/UserRepository";
import CreateUserResponse from "@/domain/shared/Responses/CreateDataResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import UserEntity from "@/domain/User/Entities/User";

@injectable()
class CreateUser {
  constructor(@inject(UserRepositoryType) private userRepository: UserRepository) {}

  validate(userData: UserData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!userData.password.isValid()) {
      result.addError({
        message: "Does not have password",
        status: "EMPTY_PASSWORD",
      });
    }

    if (!userData.email.trim()) {
      result.addError({
        message: "Does not have an email",
        status: "EMPTY_EMAIL",
      });
    }

    if (!userData.name.trim()) {
      result.addError({
        message: "Does not have a name",
        status: "EMPTY_NAME",
      });
    }

    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(userData.email)) {
      result.addError({
        message: "Does not have a valid email",
        status: "INVALID_EMAIL",
      });
    }

    return result;
  }

  async handle(userData: UserData): Promise<CreateUserResponse<UserEntity>> {
    const validation = this.validate(userData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const userExists = await this.userRepository.find(userData.email);
    if (userExists) {
      return new ErrorResponse([
        {
          message: "User already registered with this email",
          status: "USER_ALREADY_REGISTERED",
        },
      ]);
    }

    const user = await this.userRepository.create(userData);

    return new CreateUserResponse(true, user);
  }
}

export default CreateUser;

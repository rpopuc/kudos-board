import UserData from "@/domain/User/DTO/UserData";
import UserRepository from "@/domain/User/Repositories/UserRepository";
import CreateUserResponse from "@/domain/shared/Responses/CreateDataResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import UserEntity from "@/domain/User/Entities/User";

class CreateUser {
  constructor(private userRepository: UserRepository) {}

  validate(userData: UserData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!userData.password.isValid()) {
      result.addError({
        message: "Does not have password",
        status: "EMPTY_PASSWORD",
      });
    }

    return result;
  }

  async handle(userData: UserData): Promise<CreateUserResponse<UserEntity>> {
    const validation = this.validate(userData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const user = await this.userRepository.create(userData);

    return new CreateUserResponse(true, user);
  }
}

export default CreateUser;

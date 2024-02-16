import UserEntity from "@/domain/User/Entities/User";
import UserData from "@/domain/User/DTO/UserData";

export type UpdateData = {
  email: string;
  userData: UserData;
};

export const UserRepositoryType = Symbol.for("UserRepository");

interface UserRepository {
  create(userData: UserData): Promise<UserEntity>;
  find(email: string): Promise<UserEntity | null>;

  // update(data: UpdateData): Promise<UserEntity | null>;
  //
  // delete(email: string): Promise<boolean>;
  //
}

export default UserRepository;

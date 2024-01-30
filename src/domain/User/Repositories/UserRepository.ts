import UserEntity from "@/domain/User/Entities/User";
import UserData from "@/domain/User/DTO/UserData";

export type UpdateData = {
  email: string;
  userData: UserData;
};

interface UserRepository {
  create(userData: UserData): Promise<UserEntity>;

  update(data: UpdateData): Promise<UserEntity | null>;

  delete(email: string): Promise<boolean>;

  find(email: string): Promise<UserEntity | null>;
}

export default UserRepository;

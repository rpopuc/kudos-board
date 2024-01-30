import Password from "@/domain/shared/valueObjects/Password";

interface UserData {
  email: string;
  name: string;
  password: Password;
  createdAt?: Date;
  updatedAt?: Date;
}

export default UserData;

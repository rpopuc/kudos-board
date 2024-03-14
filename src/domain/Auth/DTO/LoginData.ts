import Password from "@/domain/shared/valueObjects/Password";

interface LoginData {
  email: string;
  password: Password;
}

export default LoginData;

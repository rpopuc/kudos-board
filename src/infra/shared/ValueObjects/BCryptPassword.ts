import bcrypt from "bcrypt";
import Password from "@/domain/shared/valueObjects/Password";

const SALT_ROUNDS = 10;

export default class BCryptPassword implements Password
{
  private value: string;
  private plainTextPassword: string;

  static fromHashedValue(hashedPassword: string): BCryptPassword {
    const password = new BCryptPassword("");
    password.value = hashedPassword;
    return password;
  }

  constructor(plainTextPassword: string) {
    this.plainTextPassword = plainTextPassword;
    this.value = this.hashPassword(this.plainTextPassword);
  }

  getValue(): string {
    return this.value;
  }

  compare(plainTextPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, this.value);
  }

  isValid(): boolean {
    return this.plainTextPassword.length >= 8;
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
}

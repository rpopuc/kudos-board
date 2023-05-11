import bcrypt from "bcrypt";
import InvalidPassword from "@/domains/shared/exceptions/InvalidPassword";

const SALT_ROUNDS = 10;

export default class Password {
  private value: string;

  static fromHashedValue(hashedPassword: string): Password {
    const password = new Password("--invalid-password--");
    password.value = hashedPassword;
    return password;
  }

  constructor(plainTextPassword: string) {
    if (!this.validate(plainTextPassword)) {
      throw new InvalidPassword();
    }
    this.value = this.hashPassword(plainTextPassword);
  }

  getValue(): string {
    return this.value;
  }

  compare(plainTextPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, this.value);
  }

  private validate(value: string): boolean {
    return value.length >= 8;
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
}

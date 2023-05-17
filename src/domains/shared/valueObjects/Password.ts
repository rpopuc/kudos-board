import bcrypt from "bcrypt";
import InvalidPassword from "@/domains/shared/exceptions/InvalidPassword";

const SALT_ROUNDS = 10;

export default interface Password {
  getValue(): string;

  compare(plainTextPassword: string): boolean;

  isValid(): boolean;
}

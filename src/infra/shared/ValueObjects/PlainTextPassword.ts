import Password from "@/domains/shared/valueObjects/Password";

export default class PlainTextPassword implements Password {
  private value: string;

  constructor(plainTextPassword: string) {
    this.value = plainTextPassword;
  }

  getValue(): string {
    return this.value;
  }

  compare(plainTextPassword: string): boolean {
    return plainTextPassword === this.value;
  }

  isValid(): boolean {
    return this.value.length >= 8;
  }
}

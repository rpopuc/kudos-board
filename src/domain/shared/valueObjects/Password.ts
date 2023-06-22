export default interface Password {
  getValue(): string;

  compare(plainTextPassword: string): boolean;

  isValid(): boolean;
}

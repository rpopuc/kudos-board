import Password from "@/infra/shared/ValueObjects/PlainTextPassword";

describe("Password", () => {
  const plainTextPassword = "myPassword123";

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create a Password instance with value", () => {
      const password = new Password(plainTextPassword);

      expect(password.getValue()).toBe(plainTextPassword);
    });

    it("should invalidate password does not meet the validation requirements", () => {
      const password = new Password("short");

      expect(password.isValid()).toBe(false);
    });
  });

  describe("compare", () => {
    it("should return true if the provided password matches the stored password", () => {
      const password = new Password(plainTextPassword);

      const result = password.compare(plainTextPassword);

      expect(result).toBe(true);
    });

    it("should return false if the provided password does not match the stored password", () => {
      const password = new Password(plainTextPassword);

      const result = password.compare("wrongPassword");

      expect(result).toBe(false);
    });
  });
});

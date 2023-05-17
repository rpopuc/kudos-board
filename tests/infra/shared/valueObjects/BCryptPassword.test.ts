import bcrypt from "bcrypt";
import Password from "@/infra/shared/ValueObjects/BCryptPassword";

describe("Password", () => {
  const plainTextPassword = "myPassword123";
  const hashedPassword = "$2a$10$HMyGn.5gGrx...";

  beforeEach(() => {
    jest.spyOn(bcrypt, "compareSync").mockImplementation(password => password === plainTextPassword);
    jest.spyOn(bcrypt, "hashSync").mockReturnValue(hashedPassword);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create a Password instance with hashed value", () => {
      const password = new Password(plainTextPassword);

      expect(password.getValue()).toBe(hashedPassword);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(plainTextPassword, expect.any(String));
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
      expect(bcrypt.compareSync).toHaveBeenCalledWith(plainTextPassword, hashedPassword);
    });

    it("should return false if the provided password does not match the stored password", () => {
      const password = new Password(plainTextPassword);

      const result = password.compare("wrongPassword");

      expect(result).toBe(false);
      expect(bcrypt.compareSync).toHaveBeenCalledWith("wrongPassword", hashedPassword);
    });
  });

  describe("fromHashedValue", () => {
    it("should create a Password instance with the provided hashed value", () => {
      const password = Password.fromHashedValue(hashedPassword);

      expect(password.getValue()).toBe(hashedPassword);
    });
  });
});

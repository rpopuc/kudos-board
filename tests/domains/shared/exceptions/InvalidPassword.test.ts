import InvalidPassword from "@/domain/shared/errors/InvalidPassword";

describe("InvalidPassword", () => {
  it("should create an instance of Error", () => {
    const invalidPassword = new InvalidPassword("test");

    expect(invalidPassword.message).toBe("Invalid password");
  });

  it("should create an instance of Error with custom message", () => {
    const invalidPassword = new InvalidPassword("test", "Password must be valid");

    expect(invalidPassword.message).toBe("Password must be valid");
  });

  it("should create an instance of Error with custom status", () => {
    const invalidPassword = new InvalidPassword("test", "Password must be valid", "NEW_STATUS");

    expect(invalidPassword.status).toBe("NEW_STATUS");
  });
});

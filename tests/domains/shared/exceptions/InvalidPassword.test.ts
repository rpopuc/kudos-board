import InvalidPassword from "@/domains/shared/exceptions/InvalidPassword";

describe("InvalidPassword", () => {
  it("should create an instance of Error", () => {
    const invalidPassword = new InvalidPassword();

    expect(invalidPassword.message).toBe("Invalid password");
  });

  it("should create an instance of Error with custom message", () => {
    const invalidPassword = new InvalidPassword("Password must be valid");

    expect(invalidPassword.message).toBe("Password must be valid");
  });
});

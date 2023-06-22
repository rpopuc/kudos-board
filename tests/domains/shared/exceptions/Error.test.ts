import Error from "@/domain/shared/errors/BusinessError";

describe("Error", () => {
  it("should create an instance of Error", () => {
    const status = "400";
    const message = "Bad Request";
    const error = new Error(status, message);
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(status);
    expect(error.message).toBe(message);
  });
});

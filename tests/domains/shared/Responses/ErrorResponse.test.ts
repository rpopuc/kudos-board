import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import Error from "@/domain/shared/errors/BusinessError";

type TestData = {};

describe("ErrorResponse", () => {
  it("should initialize with errors and set ok to false", () => {
    const errors: Error[] = [
      new Error("ERROR_1", "Error 1"),
      new Error("ERROR_2", "Error 2"),
      new Error("ERROR_3", "Error 3"),
    ];
    const response = new ErrorResponse<TestData>(errors);

    expect(response.ok).toBe(false);
    expect(response.data).toBeNull();
    expect(response.errors).toHaveLength(3);
    expect(response.errors).toEqual(errors);
  });
});

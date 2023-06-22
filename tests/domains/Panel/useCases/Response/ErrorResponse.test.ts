import ErrorResponse from "@/domain/Panel/UseCases/Response/ErrorResponse";
import Error from "@/domain/shared/errors/BusinessError";

describe("ErrorResponse", () => {
  it("should initialize with errors and set ok to false", () => {
    const errors: Error[] = [
      new Error("ERROR_1", "Error 1"),
      new Error("ERROR_2", "Error 2"),
      new Error("ERROR_3", "Error 3"),
    ];
    const response = new ErrorResponse(errors);

    expect(response.ok).toBe(false);
    expect(response.panel).toBeNull();
    expect(response.errors).toHaveLength(3);
    expect(response.errors).toEqual(errors);
  });
});

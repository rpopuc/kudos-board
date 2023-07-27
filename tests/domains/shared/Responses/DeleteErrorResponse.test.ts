import BusinessError from "@/domain/shared/errors/BusinessError";
import DeleteErrorResponse from "@/domain/shared/Responses/DeleteErrorResponse";

describe("DeleteErrorResponse", () => {
  it("should be an instance of DeleteErrorResponse", () => {
    const response = new DeleteErrorResponse([]);
    expect(response).toBeInstanceOf(DeleteErrorResponse);
  });

  it("should return false when success", () => {
    const response = new DeleteErrorResponse([]);

    expect(response.ok).toBe(false);
  });

  it("should return an array of errors", () => {
    const errors = [new BusinessError("Error", "Error message")];
    const response = new DeleteErrorResponse(errors);

    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].message).toEqual("Error message");
  });
});

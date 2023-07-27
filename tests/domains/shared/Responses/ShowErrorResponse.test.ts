import ShowErrorResponse from "@/domain/shared/Responses/ShowErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

describe("ShowErrorResponse", () => {
  it("should return a ShowErrorResponse with a list of errors", () => {
    const errors: BusinessError[] = [new BusinessError("error", "error message")];
    const response = new ShowErrorResponse(errors);

    expect(response.errors).toEqual(errors);
    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
  });
});

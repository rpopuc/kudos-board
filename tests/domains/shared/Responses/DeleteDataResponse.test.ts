import DeleteDataResponse from "@/domain/shared/Responses/DeleteDataResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

describe("DeleteDataResponse", () => {
  it("should be ok", () => {
    const response = new DeleteDataResponse(true);
    expect(response.ok).toBeTruthy();
    expect(response.errors).toHaveLength(0);
  });

  it("should add an error and not be ok", () => {
    const response = new DeleteDataResponse(true);
    const error = new BusinessError("Error", "Error message");
    response.addError(error);
    expect(response.ok).toBeFalsy();
    expect(response.errors).toHaveLength(1);
  });
});

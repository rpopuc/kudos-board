import UpdateDataResponse from "@/domain/shared/Responses/UpdateDataResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
type TestData = {
  message: string;
};

describe("UpdateDataResponse", () => {
  test("should add an error successfully", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Erro de negócio");
    const response = new UpdateDataResponse(true);

    expect(response.ok).toBe(true);
    expect(response.data).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("should create an instance with default values correctly", () => {
    const response = new UpdateDataResponse(false);

    expect(response.ok).toBe(false);
    expect(response.data).toBe(null);
    expect(response.errors).toEqual([]);
  });

  test("should create an instance with values ​​correctly provided", () => {
    const data: TestData = {
      message: "Test",
    };

    const errors = [new BusinessError("ERROR_STATUS_1", "Erro 1"), new BusinessError("ERROR_STATUS_2", "Erro 2")];
    const response = new UpdateDataResponse(true, data, errors);

    expect(response.ok).toBe(true);
    expect(response.data).toBe(data);
    expect(response.errors).toEqual(errors);
  });
});

import ListDataResponse from "@/domain/shared/Responses/ListDataResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

type TestData = {
  message: string;
};

describe("ListDataResponse", () => {
  test("should add an error", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Business Error");
    const response = new ListDataResponse<TestData>(true, null, []);

    expect(response.ok).toBe(true);
    expect(response.data).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("should create an instance with a valid data", () => {
    const data: TestData[] = [
      {
        message: "Test",
      },
    ];

    const errors = [new BusinessError("ERROR_STATUS_1", "Error 1"), new BusinessError("ERROR_STATUS_2", "Error 2")];
    const response = new ListDataResponse(true, data, errors);

    expect(response.ok).toBe(true);
    expect(response.data).toBe(data);
    expect(response.errors).toEqual(errors);
  });
});

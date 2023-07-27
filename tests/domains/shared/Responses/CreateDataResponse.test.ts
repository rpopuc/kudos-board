import CreateDataResponse from "@/domain/shared/Responses/CreateDataResponse";
import Error from "@/domain/shared/errors/BusinessError";

type TestData = {};

describe("CreateDataResponse", () => {
  let response: CreateDataResponse<TestData>;

  beforeEach(() => {
    response = new CreateDataResponse(true);
  });

  it("should initialize with default values", () => {
    expect(response.ok).toBe(true);
    expect(response.data).toBeNull();
    expect(response.errors).toHaveLength(0);
  });

  it("should add an error and set ok to false", () => {
    const error = new Error("ERROR", "Something went wrong");
    response.addError(error);

    expect(response.ok).toBe(false);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0]).toBe(error);
  });
});

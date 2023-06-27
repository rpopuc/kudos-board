import CreateKudosResponse from "@/domain/Kudos/UseCases/Responses/CreateKudosResponse";
import Error from "@/domain/shared/errors/BusinessError";

describe("CreateKudosResponse", () => {
  let response: CreateKudosResponse;

  beforeEach(() => {
    response = new CreateKudosResponse(true);
  });

  it("should initialize with default values", () => {
    expect(response.ok).toBe(true);
    expect(response.kudos).toBeNull();
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

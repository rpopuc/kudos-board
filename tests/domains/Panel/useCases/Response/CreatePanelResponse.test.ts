import CreatePanelResponse from "@/domains/Panel/UseCases/Response/CreatePanelResponse";
import Error from "@/domains/shared/exceptions/BusinessError";

describe("CreatePanelResponse", () => {
  let response: CreatePanelResponse;

  beforeEach(() => {
    response = new CreatePanelResponse(true);
  });

  it("should initialize with default values", () => {
    expect(response.ok).toBe(true);
    expect(response.panel).toBeNull();
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

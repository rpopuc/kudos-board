import SuccessfulResponse from "@/domain/shared/Responses/SuccessfulResponse";
import PanelEntity from "@/domain/Panel/Entities/Panel";

class TestData {}

describe("SuccessfulResponse", () => {
  it("should initialize with ok set to true and panel", () => {
    const data = new TestData();
    const response = new SuccessfulResponse(data);

    expect(response.ok).toBe(true);
    expect(response.data).toBe(data);
    expect(response.errors).toHaveLength(0);
  });
});

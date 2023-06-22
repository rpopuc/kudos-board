import SuccessfulResponse from "@/domain/Panel/UseCases/Response/SuccessfulResponse";
import PanelEntity from "@/domain/Panel/Entities/Panel";

describe("SuccessfulResponse", () => {
  it("should initialize with ok set to true and panel", () => {
    const panel = new PanelEntity({});
    const response = new SuccessfulResponse(panel);

    expect(response.ok).toBe(true);
    expect(response.panel).toBe(panel);
    expect(response.errors).toHaveLength(0);
  });
});

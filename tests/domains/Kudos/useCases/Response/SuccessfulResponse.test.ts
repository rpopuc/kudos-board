import SuccessfulResponse from "@/domain/Kudos/UseCases/Responses/SuccessfulResponse";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";

describe("SuccessfulResponse", () => {
  it("should initialize with ok set to true and kudos", () => {
    const kudos = new KudosEntity({ from: { name: "user name", id: "user-id" } });
    const response = new SuccessfulResponse(kudos);

    expect(response.ok).toBe(true);
    expect(response.kudos).toBe(kudos);
    expect(response.errors).toHaveLength(0);
  });
});

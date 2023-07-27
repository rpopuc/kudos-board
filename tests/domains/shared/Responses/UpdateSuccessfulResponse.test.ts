import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";

describe("UpdateSuccessfulResponse", () => {
  describe("When creating a UpdateSuccessfulResponse", () => {
    it("should be true", () => {
      const response = new UpdateSuccessfulResponse(true);
      expect(response.ok).toEqual(true);
    });
  });
});

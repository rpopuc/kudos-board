import ArchiveDataResponse from "@/domain/shared/Responses/ArchiveDataResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

describe("ArchiveDataResponse", () => {
  describe("when instantiated", () => {
    test("should have ok property with value true", () => {
      const response = new ArchiveDataResponse(true);

      expect(response.ok).toBe(true);
    });

    test("should have errors property with value empty array", () => {
      const response = new ArchiveDataResponse(true);

      expect(response.errors).toEqual([]);
    });
  });

  describe("when add an error", () => {
    test("should insert error in errors array", () => {
      const response = new ArchiveDataResponse(true);
      const error = new BusinessError("ERROR", "error message");

      response.addError(error);

      expect(response.errors).toContain(error);
    });

    test("should set ok property with value false", () => {
      const response = new ArchiveDataResponse(true);
      const error = new BusinessError("ERROR", "error message");

      response.addError(error);

      expect(response.ok).toBe(false);
    });
  });
});

import BusinessError from "@/domain/shared/errors/BusinessError";
import ArchiveErrorResponse from "@/domain/shared/Responses/ArchiveErrorResponse";

describe("ArchiveErrorResponse", () => {
  it("should be instance of ArchiveDataResponse", () => {
    const errors = [new BusinessError("ERROR", "Error message")];

    const archiveErrorResponse = new ArchiveErrorResponse(errors);

    expect(archiveErrorResponse).toBeInstanceOf(ArchiveErrorResponse);
  });

  it("should have errors", () => {
    const errors = [new BusinessError("ERROR", "Error message")];

    const archiveErrorResponse = new ArchiveErrorResponse(errors);

    expect(archiveErrorResponse.errors).toEqual(errors);
  });
});

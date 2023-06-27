import UpdateKudosResponse from "@/domain/Kudos/UseCases/Responses/UpdateKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";

describe("UpdateKudosResponse", () => {
  test("should add an error successfuly", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Business Error");
    const response = new UpdateKudosResponse(true);

    expect(response.ok).toBe(true);
    expect(response.kudos).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("Should create an instance with correctly values", () => {
    const response = new UpdateKudosResponse(false);

    expect(response.ok).toBe(false);
    expect(response.kudos).toBe(null);
    expect(response.errors).toEqual([]);
  });

  test("Should create an instance with the provided params", () => {
    const currentUpdatedAt = new Date("2021-01-01 00:00:00");
    const kudosData: KudosData = {
      panelSlug: "panel-slug",
      title: "Old Title",
      from: { name: "Owner", id: "owner-id" },
      description: "Old Description",
      to: "Old Recipient",
      updatedAt: currentUpdatedAt,
    };

    const kudos = new KudosEntity(kudosData);
    const errors = [new BusinessError("ERROR_STATUS_1", "Erro 1"), new BusinessError("ERROR_STATUS_2", "Erro 2")];
    const response = new UpdateKudosResponse(true, kudos, errors);

    expect(response.ok).toBe(true);
    expect(response.kudos).toBe(kudos);
    expect(response.errors).toEqual(errors);
  });
});

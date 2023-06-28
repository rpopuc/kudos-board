import ShowKudosResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";

describe("ShowKudosResponse", () => {
  test("should add an error", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Business Error");
    const response = new ShowKudosResponse(true, null, []);

    expect(response.ok).toBe(true);
    expect(response.kudos).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("should create an instance with a valid Kudos", () => {
    const from = { id: "user-1", name: "User 1" };

    const kudosData = {
      title: "Example Title",
      description: "Example Description",
      from,
      to: "User 2",
      panelSlug: "panel-slug-1",
    } as KudosData;

    const kudos = new KudosEntity(kudosData);
    const errors = [new BusinessError("ERROR_STATUS_1", "Erro 1"), new BusinessError("ERROR_STATUS_2", "Erro 2")];
    const response = new ShowKudosResponse(true, kudos, errors);

    expect(response.ok).toBe(true);
    expect(response.kudos).toBe(kudos);
    expect(response.errors).toEqual(errors);
  });
});

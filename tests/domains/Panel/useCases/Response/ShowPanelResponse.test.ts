import ShowPanelResponse from "@/domain/Panel/UseCases/Response/ShowPanelResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import PanelEntity from "@/domain/Panel/Entities/Panel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domain/Panel/DTO/PanelData";

describe("ShowPanelResponse", () => {
  test("should add an error", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Business Error");
    const response = new ShowPanelResponse(true, null, []);

    expect(response.ok).toBe(true);
    expect(response.panel).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("shoul create an instance with a valid Panel", () => {
    const panelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const panel = new PanelEntity(panelData);
    const errors = [new BusinessError("ERROR_STATUS_1", "Erro 1"), new BusinessError("ERROR_STATUS_2", "Erro 2")];
    const response = new ShowPanelResponse(true, panel, errors);

    expect(response.ok).toBe(true);
    expect(response.panel).toBe(panel);
    expect(response.errors).toEqual(errors);
  });
});

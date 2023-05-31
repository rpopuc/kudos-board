import UpdatePanelResponse from "@/domains/Panel/UseCases/Response/UpdatePanelResponse";
import BusinessError from "@/domains/shared/errors/BusinessError";
import PanelEntity from "@/domains/Panel/Entities/Panel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelData from "@/domains/Panel/DTO/PanelData";

describe("UpdatePanelResponse", () => {
  test("deve adicionar um erro corretamente", () => {
    const businessError = new BusinessError("ERROR_STATUS", "Erro de negócio");
    const response = new UpdatePanelResponse(true);

    expect(response.ok).toBe(true);
    expect(response.panel).toBe(null);
    expect(response.errors).toEqual([]);

    response.addError(businessError);

    expect(response.ok).toBe(false);
    expect(response.errors).toEqual([businessError]);
  });

  test("deve criar uma instância com valores padrão corretamente", () => {
    const response = new UpdatePanelResponse(false);

    expect(response.ok).toBe(false);
    expect(response.panel).toBe(null);
    expect(response.errors).toEqual([]);
  });

  test("deve criar uma instância com valores fornecidos corretamente", () => {
    const panelData: PanelData = {
      title: "Old Title",
      owner: "Old Owner",
      password: new PlainTextPassword("oldPassword"),
    };

    const panel = new PanelEntity(panelData);
    const errors = [new BusinessError("ERROR_STATUS_1", "Erro 1"), new BusinessError("ERROR_STATUS_2", "Erro 2")];
    const response = new UpdatePanelResponse(true, panel, errors);

    expect(response.ok).toBe(true);
    expect(response.panel).toBe(panel);
    expect(response.errors).toEqual(errors);
  });
});

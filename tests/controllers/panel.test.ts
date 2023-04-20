import { Request, Response } from "express";
import CreatePanel from "../../src/domains/useCases/CreatePanel";
import Panel from "../../src/domains/entities/Panel";
import PanelController from "../../src/controllers/Panel";

describe("Panel Controller", () => {
  describe("@index", () => {
    it("should show a stored panel", () => {
      const mockRequest = {
        params: {
          slug: "1",
        },
        body: {}
      } as unknown as Request;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      const useCase = new CreatePanel();

      const panelController = new PanelController(useCase);
      panelController.index()(mockRequest, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith(`Panel::index${mockRequest.params.slug}`);
    });
  });

  describe("@store", () => {
    it("should create a panel and return a success message", () => {
      const mockRequest = {
        body: {
          description: "This is a test panel",
          name: "Test Panel",
        },
      } as Request;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      const useCase = new CreatePanel();
      const panelData = { slug: "test-panel" };
      jest.spyOn(useCase, "handle").mockReturnValue(new Panel(panelData));

      const panelController = new PanelController(useCase);
      panelController.store()(mockRequest, mockResponse);

      expect(useCase.handle).toHaveBeenCalledWith(mockRequest.body);
    });
  });
});

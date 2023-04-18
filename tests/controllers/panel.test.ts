import { Request, Response } from "express";
import CreatePanel from "../../src/domains/useCases/CreatePanel";
import Panel from "../../src/domains/entities/Panel";
import PanelController from "../../src/controllers/Panel";

describe("Panel Controller", () => {
  describe("can store a panel", () => {
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
      panelController.store(mockRequest, mockResponse);

      expect(useCase.handle).toHaveBeenCalledWith(mockRequest.body);
    });
  });
});

import { Request, Response } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import Panel from "@/domains/Panel/Entities/Panel";
import PanelController from "@/controllers/Panel";
import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";

describe("Panel Controller", () => {
  describe("@index", () => {
    it("should show a stored panel", () => {
      const mockRequest = {
        params: {
          slug: "1",
        },
        body: {},
      } as unknown as Request;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as Response;

      const panelRepository = new PanelRepository();
      const useCase = new CreatePanel(panelRepository);

      const panelController = new PanelController(useCase);
      panelController.index()(mockRequest, mockResponse, () => {});

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

      const panelRepository = new PanelRepository();
      const useCase = new CreatePanel(panelRepository);
      const panelData = { slug: "test-panel" };
      jest.spyOn(useCase, "handle").mockResolvedValueOnce(new Panel(panelData));

      const panelController = new PanelController(useCase);
      panelController.store()(mockRequest, mockResponse, () => {});

      expect(useCase.handle).toHaveBeenCalledWith(mockRequest.body);
    });
  });
});

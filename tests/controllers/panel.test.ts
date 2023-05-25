import { Request, Response } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";
import SuccessfulResponse from "@/domains/Panel/UseCases/Response/SuccessfulResponse";
import Panel from "@/domains/Panel/Entities/Panel";
import PanelController from "@/controllers/PanelController";
import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import Error from "@/domains/shared/exceptions/BusinessError";

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
    it("should create a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const panelRepository = new PanelRepository();
      const useCase = new CreatePanel(panelRepository);
      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };
      jest.spyOn(useCase, "handle").mockResolvedValueOnce(new SuccessfulResponse(new Panel(panelData)));

      const panelController = new PanelController(useCase);
      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(useCase.handle).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "test",
          title: "Test Panel",
        }),
      );
    });

    it("should validate data when creating a panel", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const panelRepository = new PanelRepository();
      const useCase = new CreatePanel(panelRepository);
      jest
        .spyOn(useCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new Error("ERROR", "Error creating panel")]));

      const panelController = new PanelController(useCase);

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(useCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error creating panel"] });
    });
  });
});

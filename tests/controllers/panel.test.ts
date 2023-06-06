import { Request, Response } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import ErrorResponse from "@/domains/Panel/UseCases/Response/ErrorResponse";
import SuccessfulResponse from "@/domains/Panel/UseCases/Response/SuccessfulResponse";
import UpdateSuccessfulResponse from "@/domains/Panel/UseCases/Response/UpdateSuccessfulResponse";
import DeletePanelResponse from "@/domains/Panel/UseCases/Response/DeletePanelResponse";
import Panel from "@/domains/Panel/Entities/Panel";
import PanelController from "@/controllers/PanelController";
import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import Error from "@/domains/shared/errors/BusinessError";
import DeletePanel from "@/domains/Panel/UseCases/DeletePanel";
import UpdatePanel from "@/domains/Panel/UseCases/UpdatePanel";

describe("Panel Controller", () => {
  let panelController: PanelController;
  let panelRepository: PanelRepository;
  let createPanelUseCase: CreatePanel;
  let deletePanelUseCase: DeletePanel;
  let updatePanelUseCase: UpdatePanel;

  beforeEach(() => {
    panelRepository = new PanelRepository();
    createPanelUseCase = new CreatePanel(panelRepository);
    deletePanelUseCase = new DeletePanel(panelRepository);
    updatePanelUseCase = new UpdatePanel(panelRepository);

    panelController = new PanelController(createPanelUseCase, deletePanelUseCase, updatePanelUseCase);
  });

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

      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };

      jest.spyOn(createPanelUseCase, "handle").mockResolvedValueOnce(new SuccessfulResponse(new Panel(panelData)));

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(createPanelUseCase.handle).toHaveBeenCalledWith(mockRequest.body);
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

      jest
        .spyOn(createPanelUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new Error("ERROR", "Error creating panel")]));

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(createPanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error creating panel"] });
    });
  });

  describe("@update", () => {
    it("should update a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };

      jest
        .spyOn(updatePanelUseCase, "handle")
        .mockResolvedValueOnce(new UpdateSuccessfulResponse(new Panel(panelData)));

      await panelController.update()(mockRequest, mockResponse, () => {});

      expect(updatePanelUseCase.handle).toHaveBeenCalledWith("1", mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          owner: "test",
          title: "Test Panel",
        }),
      );
    });

    it("should validate data when updating a panel", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
        params: {
          id: "1",
        },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jest
        .spyOn(updatePanelUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new Error("ERROR", "Error updating panel")]));

      await panelController.update()(mockRequest, mockResponse, () => {});

      expect(updatePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error updating panel"] });
    });
  });

  describe("@delete", () => {
    it("should delete a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: { id: "panel-1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(deletePanelUseCase, "handle").mockResolvedValueOnce(new DeletePanelResponse(true));

      await panelController.delete()(mockRequest, mockResponse, () => {});

      expect(deletePanelUseCase.handle).toHaveBeenCalledWith("panel-1", "user-1");
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Panel deleted successfully" }),
      );
    });

    it("should validate data when updating a panel", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: {
          id: "panel-1",
        },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jest
        .spyOn(deletePanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new Error("NOT_AUTHORIZED", "You can not delete a panel that is not yours.")]),
        );

      await panelController.delete()(mockRequest, mockResponse, () => {});

      expect(deletePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "You can not delete a panel that is not yours." });
    });
  });
});

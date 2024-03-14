import { Request, Response } from "express";
import CreatePanel from "@/domain/Panel/UseCases/CreatePanel";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import SuccessfulResponse from "@/domain/shared/Responses/SuccessfulResponse";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import DeletePanelResponse from "@/domain/shared/Responses/DeleteDataResponse";
import ShowPanelResponse from "@/domain/shared/Responses/ShowDataResponse";
import ShowPanelErrorResponse from "@/domain/shared/Responses/ShowErrorResponse";
import ArchivePanelResponse from "@/domain/shared/Responses/ArchiveDataResponse";
import Panel from "@/domain/Panel/Entities/Panel";
import PanelController from "@/infra/adapters/Express/controllers/PanelController";
import PanelRepository from "@/infra/Memory/Panel/Repositories/PanelRepository";
import BusinessError from "@/domain/shared/errors/BusinessError";
import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import PanelPresenter from "@/domain/Panel/Presenters/PanelPresenter";
import type { PanelPresentation } from "@/domain/Panel/Presenters/PanelPresenter";
import ArchivePanel from "@/domain/Panel/UseCases/ArchivePanel";
import { AuthenticatedRequest } from "@/infra/adapters/Express/middlewares/AuthorizeMiddleware";

describe("Panel Controller", () => {
  let panelController: PanelController;
  let panelRepository: PanelRepository;
  let createPanelUseCase: CreatePanel;
  let deletePanelUseCase: DeletePanel;
  let updatePanelUseCase: UpdatePanel;
  let showPanelUseCase: ShowPanel;
  let archivePanelUseCase: ArchivePanel;
  let presenter: PanelPresenter;

  beforeEach(() => {
    panelRepository = new PanelRepository();
    createPanelUseCase = new CreatePanel(panelRepository);
    deletePanelUseCase = new DeletePanel(panelRepository);
    updatePanelUseCase = new UpdatePanel(panelRepository);
    showPanelUseCase = new ShowPanel(panelRepository);
    archivePanelUseCase = new ArchivePanel(panelRepository);
    presenter = new PanelPresenter();

    panelController = new PanelController(
      createPanelUseCase,
      deletePanelUseCase,
      updatePanelUseCase,
      showPanelUseCase,
      archivePanelUseCase,
      presenter,
    );
  });

  describe("@index", () => {
    it("should list registered panels", async () => {
      const mockRequest = {
        params: {},
        body: {},
        authorizedUserId: "user-id",
      } as AuthenticatedRequest;

      const mockResponse = {
        json: jest.fn(),
      } as Partial<Response> as Response;

      await panelController.index()(mockRequest, mockResponse, () => {});

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          userId: "user-id",
        }),
      );
    });

    it("should return an error message when panel not found", async () => {
      const mockRequest = {
        params: {
          slug: "test-panel",
        },
        body: {
          clientPassword: "teste12345",
        },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(showPanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ShowPanelErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not find panel.")]),
        );

      jest.spyOn(presenter, "single");

      await panelController.show()(mockRequest, mockResponse, () => {});

      expect(presenter.single).not.toHaveBeenCalled();
      expect(showPanelUseCase.handle).toHaveBeenCalledWith({ panelSlug: "test-panel", clientPassword: "teste12345" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Could not find panel."] });
    });
  });

  describe("@show", () => {
    it("should show a stored panel", async () => {
      const mockRequest = {
        params: {
          slug: "test-panel",
        },
        body: {
          clientPassword: "teste12345",
        },
      } as Request<{ slug: string }>;

      const mockResponse = {
        json: jest.fn(),
      } as Partial<Response> as Response;

      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };
      const panel = new Panel(panelData);
      const presenterData = { owner: "test", title: "Test Panel" } as PanelPresentation;

      jest.spyOn(showPanelUseCase, "handle").mockResolvedValueOnce(new ShowPanelResponse(true, panel));
      jest.spyOn(presenter, "single").mockReturnValue(presenterData);

      await panelController.show()(mockRequest, mockResponse, () => {});

      expect(showPanelUseCase.handle).toHaveBeenCalledWith({ panelSlug: "test-panel", clientPassword: "teste12345" });
      expect(presenter.single).toHaveBeenCalledWith(panel);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });

    it("should return an error message when panel not found", async () => {
      const mockRequest = {
        params: {
          slug: "test-panel",
        },
        body: {
          clientPassword: "teste12345",
        },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(showPanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ShowPanelErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not find panel.")]),
        );

      jest.spyOn(presenter, "single");

      await panelController.show()(mockRequest, mockResponse, () => {});

      expect(presenter.single).not.toHaveBeenCalled();
      expect(showPanelUseCase.handle).toHaveBeenCalledWith({ panelSlug: "test-panel", clientPassword: "teste12345" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Could not find panel."] });
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
        headers: {
          "user-id": "user-1",
        },
      } as Partial<Request> as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };
      const panel = new Panel(panelData);
      const presenterData = {
        owner: "test",
        title: "Test Panel",
      } as PanelPresentation;

      jest.spyOn(createPanelUseCase, "handle").mockResolvedValueOnce(new SuccessfulResponse(panel));
      jest.spyOn(presenter, "single").mockReturnValue(presenterData);

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(createPanelUseCase.handle).toHaveBeenCalledWith(mockRequest.body);
      expect(presenter.single).toHaveBeenCalledWith(panel);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });

    it("should validate data when creating a panel", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
        headers: {
          "user-id": "user-1",
        },
      } as Partial<Request> as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest.spyOn(presenter, "single");

      jest
        .spyOn(createPanelUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new BusinessError("ERROR", "Error creating panel")]));

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(createPanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(presenter.single).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error creating panel"] });
    });

    it("should create a panel with client password and return a success message", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
          clientPassword: "client12345",
        },
        headers: {
          "user-id": "user-1",
        },
      } as Partial<Request> as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      const panelData = {
        owner: "test",
        slug: "test-panel",
        title: "Test Panel",
        password: "teste12345",
        clientPassword: "client12345",
      };
      const panel = new Panel(panelData);
      const presenterData = {
        owner: "test",
        title: "Test Panel",
      } as PanelPresentation;

      jest.spyOn(createPanelUseCase, "handle").mockResolvedValueOnce(new SuccessfulResponse(panel));
      jest.spyOn(presenter, "single").mockReturnValue(presenterData);

      await panelController.store()(mockRequest, mockResponse, () => {});

      expect(createPanelUseCase.handle).toHaveBeenCalledWith(mockRequest.body);
      expect(presenter.single).toHaveBeenCalledWith(panel);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });
  });

  describe("@update", () => {
    it("should update a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
          owner: "test",
          title: "Test Panel",
          description: "This is a test panel",
          password: "teste12345",
        },
        params: { slug: "1" },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      const panelData = { owner: "test", slug: "test-panel", title: "Test Panel", password: "teste12345" };
      const presenterData = { owner: "test", title: "Test Panel" } as PanelPresentation;
      const panel = new Panel(panelData);

      jest.spyOn(presenter, "single").mockReturnValue(presenterData);
      jest.spyOn(updatePanelUseCase, "handle").mockResolvedValueOnce(new UpdateSuccessfulResponse(panel));

      await panelController.update()(mockRequest, mockResponse, () => {});

      expect(updatePanelUseCase.handle).toHaveBeenCalledWith({
        panelSlug: "1",
        userId: "user-1",
        updatePanelData: mockRequest.body,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
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
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(updatePanelUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new BusinessError("ERROR", "Error updating panel")]));

      await panelController.update()(mockRequest, mockResponse, () => {});

      expect(updatePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error updating panel"] });
    });

    it("should validate when panel does not exist", async () => {
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
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(updatePanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "Could not found a panel with the provided ID.")]),
        );

      await panelController.update()(mockRequest, mockResponse, () => {});

      expect(updatePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Could not found a panel with the provided ID."] });
    });
  });

  describe("@delete", () => {
    it("should delete a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: { slug: "panel-1" },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      jest.spyOn(deletePanelUseCase, "handle").mockResolvedValueOnce(new DeletePanelResponse(true));

      await panelController.delete()(mockRequest, mockResponse, () => {});

      expect(deletePanelUseCase.handle).toHaveBeenCalledWith({
        panelSlug: "panel-1",
        userId: "user-1",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Panel deleted successfully" }),
      );
    });

    it("should validate data when deleting a panel", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: {
          id: "panel-1",
        },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest.spyOn(presenter, "single");

      jest
        .spyOn(deletePanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not delete a panel that is not yours.")]),
        );

      await panelController.delete()(mockRequest, mockResponse, () => {});

      expect(deletePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(presenter.single).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "You can not delete a panel that is not yours." });
    });
  });

  describe("@archive", () => {
    it("should arhcive a panel and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: { id: "panel-1" },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      jest.spyOn(archivePanelUseCase, "handle").mockResolvedValueOnce(new ArchivePanelResponse(true));

      await panelController.archive()(mockRequest, mockResponse, () => {});

      expect(archivePanelUseCase.handle).toHaveBeenCalledWith({
        panelSlug: "panel-1",
        userId: "user-1",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Panel archived successfully" }),
      );
    });

    it("should validate data when archiving a panel", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: {
          id: "panel-1",
        },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(archivePanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not archive a panel that is not yours.")]),
        );

      await panelController.archive()(mockRequest, mockResponse, () => {});

      expect(archivePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["You can not archive a panel that is not yours."] });
    });

    it("should validate when panel does not exist", async () => {
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
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(archivePanelUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("PANEL_NOT_FOUND", "You can not archive a panel that does not exist.")]),
        );

      await panelController.archive()(mockRequest, mockResponse, () => {});

      expect(archivePanelUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["You can not archive a panel that does not exist."] });
    });
  });
});

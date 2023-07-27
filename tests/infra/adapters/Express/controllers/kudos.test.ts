import { Request, Response } from "express";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import SuccessfulResponse from "@/domain/shared/Responses/SuccessfulResponse";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import DeleteKudosResponse from "@/domain/shared/Responses/DeleteDataResponse";
import Kudos from "@/domain/Kudos/Entities/Kudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import BusinessError from "@/domain/shared/errors/BusinessError";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
import ShowKudosResponse from "@/domain/shared/Responses/ShowDataResponse";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";
import type { KudosPresentation } from "@/domain/Kudos/Presenters/KudosPresenter";
import ShowKudosErrorResponse from "@/domain/shared/Responses/ShowErrorResponse";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import ArchiveKudosResponse from "@/domain/shared/Responses/ArchiveDataResponse";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";

describe("Kudos Controller", () => {
  let kudosController: KudosController;
  let kudosRepository: KudosRepository;
  let createKudosUseCase: CreateKudos;
  let deleteKudosUseCase: DeleteKudos;
  let updateKudosUseCase: UpdateKudos;
  let showKudosUseCase: ShowKudos;
  let archiveKudosUseCase: ArchiveKudos;
  let presenter: KudosPresenter;

  beforeEach(() => {
    kudosRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as KudosRepository;
    createKudosUseCase = new CreateKudos(kudosRepository);
    deleteKudosUseCase = new DeleteKudos(kudosRepository);
    updateKudosUseCase = new UpdateKudos(kudosRepository);
    showKudosUseCase = new ShowKudos(kudosRepository);
    archiveKudosUseCase = new ArchiveKudos(kudosRepository);
    presenter = new KudosPresenter();

    kudosController = new KudosController(
      createKudosUseCase,
      deleteKudosUseCase,
      updateKudosUseCase,
      showKudosUseCase,
      archiveKudosUseCase,
      presenter,
    );
  });

  describe("@store", () => {
    it("should create a kudos and return a success message", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Kudos",
          description: "This is a test kudos",
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

      const kudosData = {
        from: { id: "test", name: "Test Name" },
        to: "to name",
        panelSlug: "panel-slug",
        title: "Test Kudos",
        description: "Test Kudos Description",
      };
      const kudos = new Kudos(kudosData);
      const presenterData = {
        from: "test",
        to: "to name",
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        createdAt: new Date(),
      } as KudosPresentation;

      jest.spyOn(createKudosUseCase, "handle").mockResolvedValueOnce(new SuccessfulResponse(kudos));
      jest.spyOn(presenter, "single").mockReturnValue(presenterData);

      await kudosController.store()(mockRequest, mockResponse, () => {});

      expect(createKudosUseCase.handle).toHaveBeenCalledWith(mockRequest.body);
      expect(presenter.single).toHaveBeenCalledWith(kudos);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });

    it("should validate data when creating a kudos", async () => {
      const mockRequest = {
        body: {
          title: "Test Kudos",
          description: "This is a test kudos",
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
        .spyOn(createKudosUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse<Kudos>([new BusinessError("ERROR", "Error creating kudos")]));

      await kudosController.store()(mockRequest, mockResponse, () => {});

      expect(createKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(presenter.single).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error creating kudos"] });
    });
  });

  describe("@delete", () => {
    it("should delete a kudos and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: { slug: "kudos-1" },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      jest.spyOn(deleteKudosUseCase, "handle").mockResolvedValueOnce(new DeleteKudosResponse(true));

      await kudosController.delete()(mockRequest, mockResponse, () => {});

      expect(deleteKudosUseCase.handle).toHaveBeenCalledWith({
        slug: "kudos-1",
        userId: "user-1",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Kudos deleted successfully" }),
      );
    });

    it("should validate data when deleting a kudos", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: {
          id: "kudos-1",
        },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest.spyOn(presenter, "single");

      jest
        .spyOn(deleteKudosUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not delete a kudos that is not yours.")]),
        );

      await kudosController.delete()(mockRequest, mockResponse, () => {});

      expect(deleteKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(presenter.single).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "You can not delete a kudos that is not yours." });
    });
  });

  describe("@update", () => {
    it("should update a kudos and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
          owner: "test",
          title: "Test Kudos",
          description: "This is a test kudos",
        },
        params: { slug: "1" },
      } as Request<{ slug: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      const kudosData = {
        from: { id: "test", name: "Test Name" },
        to: "to name",
        panelSlug: "panel-slug",
        title: "Test Kudos",
        description: "Test Kudos Description",
      };
      const kudos = new Kudos(kudosData);
      const presenterData = {
        from: "test",
        to: "to name",
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        createdAt: new Date(),
      } as KudosPresentation;

      jest.spyOn(presenter, "single").mockReturnValue(presenterData);
      jest.spyOn(updateKudosUseCase, "handle").mockResolvedValueOnce(new UpdateSuccessfulResponse(kudos));

      await kudosController.update()(mockRequest, mockResponse, () => {});

      expect(updateKudosUseCase.handle).toHaveBeenCalledWith({
        kudosSlug: "1",
        userId: "user-1",
        updateKudosData: mockRequest.body,
      });
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });

    it("should validate data when updating a kudos", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Kudos",
          description: "This is a test kudos",
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
        .spyOn(updateKudosUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([new BusinessError("ERROR", "Error updating kudos")]));

      await kudosController.update()(mockRequest, mockResponse, () => {});

      expect(updateKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Error updating kudos"] });
    });

    it("should validate when kudos does not exist", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Kudos",
          description: "This is a test kudos",
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
        .spyOn(updateKudosUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse<Kudos>([
            new BusinessError("PANEL_NOT_FOUND", "Could not found a kudos with the provided ID."),
          ]),
        );

      await kudosController.update()(mockRequest, mockResponse, () => {});

      expect(updateKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Could not found a kudos with the provided ID."] });
    });
  });

  describe("@show", () => {
    it("should show a stored kudos", async () => {
      const mockRequest = {
        params: {
          slug: "test-kudos",
        },
      } as Request<{ slug: string }>;

      const mockResponse = {
        json: jest.fn(),
      } as Partial<Response> as Response;

      const kudosData = {
        from: { id: "test", name: "Test Name" },
        to: "to name",
        panelSlug: "panel-slug",
        title: "Test Kudos",
        description: "Test Kudos Description",
      };
      const kudos = new Kudos(kudosData);
      const presenterData = {
        from: "test",
        to: "to name",
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        createdAt: new Date(),
      } as KudosPresentation;

      jest.spyOn(showKudosUseCase, "handle").mockResolvedValueOnce(new ShowKudosResponse<Kudos>(true, kudos));
      jest.spyOn(presenter, "single").mockReturnValue(presenterData);

      await kudosController.show()(mockRequest, mockResponse, () => {});

      expect(showKudosUseCase.handle).toHaveBeenCalledWith({ slug: "test-kudos" });
      expect(presenter.single).toHaveBeenCalledWith(kudos);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(presenterData));
    });

    it("should return an error message when kudos not found", async () => {
      const mockRequest = {
        params: {
          slug: "test-kudos",
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
        .spyOn(showKudosUseCase, "handle")
        .mockResolvedValueOnce(
          new ShowKudosErrorResponse<Kudos>([new BusinessError("PANEL_NOT_FOUND", "Could not find kudos.")]),
        );

      jest.spyOn(presenter, "single");

      await kudosController.show()(mockRequest, mockResponse, () => {});

      expect(presenter.single).not.toHaveBeenCalled();
      expect(showKudosUseCase.handle).toHaveBeenCalledWith({ slug: "test-kudos" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["Could not find kudos."] });
    });
  });

  describe("@archive", () => {
    it("should arhcive a kudos and return a success message", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: { id: "kudos-1" },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      jest.spyOn(archiveKudosUseCase, "handle").mockResolvedValueOnce(new ArchiveKudosResponse(true));

      await kudosController.archive()(mockRequest, mockResponse, () => {});

      expect(archiveKudosUseCase.handle).toHaveBeenCalledWith({
        slug: "kudos-1",
        userId: "user-1",
      });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Kudos archived successfully" }),
      );
    });

    it("should validate data when archiving a kudos", async () => {
      const mockRequest = {
        body: {
          userId: "user-1",
        },
        params: {
          id: "kudos-1",
        },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(archiveKudosUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not archive a kudos that is not yours.")]),
        );

      await kudosController.archive()(mockRequest, mockResponse, () => {});

      expect(archiveKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["You can not archive a kudos that is not yours."] });
    });

    it("should validate when kudos does not exist", async () => {
      const mockRequest = {
        body: {
          owner: "test",
          title: "Test Kudos",
          description: "This is a test kudos",
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
        .spyOn(archiveKudosUseCase, "handle")
        .mockResolvedValueOnce(
          new ErrorResponse([new BusinessError("KUDOS_NOT_FOUND", "You can not archive a kudos that does not exist.")]),
        );

      await kudosController.archive()(mockRequest, mockResponse, () => {});

      expect(archiveKudosUseCase.handle).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["You can not archive a kudos that does not exist."] });
    });
  });
});

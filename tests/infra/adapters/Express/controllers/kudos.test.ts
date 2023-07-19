import { Request, Response } from "express";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import ErrorResponse from "@/domain/Kudos/UseCases/Responses/ErrorResponse";
import SuccessfulResponse from "@/domain/Kudos/UseCases/Responses/SuccessfulResponse";
// import UpdateSuccessfulResponse from "@/domain/Kudos/UseCases/Responses/UpdateSuccessfulResponse";
import DeleteKudosResponse from "@/domain/Kudos/UseCases/Responses/DeleteKudosResponse";
import Kudos from "@/domain/Kudos/Entities/Kudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import BusinessError from "@/domain/shared/errors/BusinessError";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
// import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
// import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
// import ShowKudosResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosResponse";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";
import type { KudosPresentation } from "@/domain/Kudos/Presenters/KudosPresenter";
// import ShowKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosErrorResponse";
// import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
// import ArchiveKudosResponse from "@/domain/Kudos/UseCases/Responses/ArchiveKudosResponse";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";

describe("Kudos Controller", () => {
  let kudosController: KudosController;
  let kudosRepository: KudosRepository;
  let createKudosUseCase: CreateKudos;
  let deleteKudosUseCase: DeleteKudos;
  // let updateKudosUseCase: UpdateKudos;
  // let showKudosUseCase: ShowKudos;
  // let archiveKudosUseCase: ArchiveKudos;
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
    // updateKudosUseCase = new UpdateKudos(kudosRepository);
    // showKudosUseCase = new ShowKudos(kudosRepository);
    // archiveKudosUseCase = new ArchiveKudos(kudosRepository);
    presenter = new KudosPresenter();

    kudosController = new KudosController(
      createKudosUseCase,
      deleteKudosUseCase,
      // updateKudosUseCase,
      // showKudosUseCase,
      // archiveKudosUseCase,
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
        .mockResolvedValueOnce(new ErrorResponse([new BusinessError("ERROR", "Error creating kudos")]));

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
});

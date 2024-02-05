import UserPresenter, { UserPresentation } from "@/domain/User/Presenters/UserPresenter";
import UserController from "@/infra/adapters/Express/controllers/UserController";
import CreateUser from "@/domain/User/UseCases/CreateUser";
import UserRepository from "@/domain/User/Repositories/UserRepository";
import { Request, Response } from "express";
import CreateUserResponse from "@/domain/shared/Responses/CreateDataResponse";
import User from "@/domain/User/Entities/User";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";

describe("User Controller", () => {
  let userController: UserController;
  let presenter: UserPresenter;
  let createUserUseCase: CreateUser;
  let userRepository: UserRepository;

  beforeEach(() => {
    presenter = new UserPresenter();
    createUserUseCase = new CreateUser(userRepository);
    userController = new UserController(createUserUseCase, presenter);
  });

  describe("store", () => {
    it("should return a user entity with the correct data", async () => {
      const userData = {
        email: "user@example.com",
        name: "Example User",
        password: "sample-password-test",
      };

      const user = new User({ ...userData, id: "user-id" });

      const userPresentation = {
        name: userData.name,
        id: "user-id",
      } as UserPresentation;

      const mockRequest = {
        body: userData,
      } as Request<{ email: string; name: string; password: string }>;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as Partial<Response> as Response;

      jest.spyOn(createUserUseCase, "handle").mockResolvedValueOnce(new CreateUserResponse(true, user));

      await userController.store()(mockRequest, mockResponse, () => {});

      expect(createUserUseCase.handle).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(userPresentation));
    });

    it("should return an error when user is not created", async () => {
      const userData = {
        email: "user@example.com",
        name: "Example User",
        password: "sample-password-test",
      };

      const mockRequest = {
        body: userData,
      } as Request<{ email: string; name: string; password: string }>;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as Partial<Response> as Response;

      jest
        .spyOn(createUserUseCase, "handle")
        .mockResolvedValueOnce(new ErrorResponse([{ message: "User was not created", status: "INTERNAL_ERROR" }]));

      await userController.store()(mockRequest, mockResponse, () => {});

      expect(createUserUseCase.handle).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ["User was not created"] });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});

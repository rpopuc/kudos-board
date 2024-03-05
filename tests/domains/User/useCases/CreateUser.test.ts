import "reflect-metadata";
import CreateUser from "@/domain/User/UseCases/CreateUser";
import UserRepository from "@/domain/User/Repositories/UserRepository";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import UserData from "@/domain/User/DTO/UserData";
import UserEntity from "@/domain/User/Entities/User";

describe("CreateUser", () => {
  describe("handle", () => {
    let userRepository: UserRepository;
    let createUser: CreateUser;

    beforeEach(() => {
      userRepository = {
        create: jest.fn(),
        update: jest.fn(),
        archive: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
      } as UserRepository;

      createUser = new CreateUser(userRepository);
    });

    it("should return a new user entity with the correct data", async () => {
      const userData = {
        email: "user@example.com",
        name: "Example User",
        password: new PlainTextPassword("teste12345"),
      } as UserData;

      const memoryUserEntity = new UserEntity(userData);

      jest.spyOn(userRepository, "create").mockImplementation(async () => memoryUserEntity);

      const createUser = new CreateUser(userRepository);
      const response = await createUser.handle(userData);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
          password: userData.password,
        }),
      );
      expect(response.data).toStrictEqual(memoryUserEntity);
    });

    it("should return an error if password is missing", async () => {
      const invalidUserData: UserData = {
        email: "user@example.com",
        name: "Example User",
        password: new PlainTextPassword(""),
      };

      const response = await createUser.handle(invalidUserData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have password");
      expect(response.errors[0].status).toBe("EMPTY_PASSWORD");
      expect(response.data).toBe(null);
    });

    it("should return an error if email is missing", async () => {
      const invalidUserData: UserData = {
        email: "",
        name: "Example User",
        password: new PlainTextPassword("examplePassword"),
      };

      const response = await createUser.handle(invalidUserData);
      expect(response.ok).toBe(false);
      expect(response.errors[0].message).toBe("Does not have an email");
      expect(response.errors[0].status).toBe("EMPTY_EMAIL");
      expect(response.data).toBe(null);
    });

    it("should return an error if email is invalid", async () => {
      const invalidUserData: UserData = {
        email: "invalid-email",
        name: "Example User",
        password: new PlainTextPassword("examplePassword"),
      };

      const response = await createUser.handle(invalidUserData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have a valid email");
      expect(response.errors[0].status).toBe("INVALID_EMAIL");
      expect(response.data).toBe(null);
    });

    it("should return an error if name is missing", async () => {
      const invalidUserData: UserData = {
        email: "test@example.com",
        name: "",
        password: new PlainTextPassword("examplePassword"),
      };

      const response = await createUser.handle(invalidUserData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have a name");
      expect(response.errors[0].status).toBe("EMPTY_NAME");
      expect(response.data).toBe(null);
    });

    it("should return an error if user email already exists", async () => {
      const userData: UserData = {
        email: "test@example.com",
        name: "Example Test",
        password: new PlainTextPassword("examplePassword"),
      };

      const memoryUserEntity = new UserEntity(userData);

      jest.spyOn(userRepository, "find").mockImplementation(async () => memoryUserEntity);

      const createUser = new CreateUser(userRepository);
      const response = await createUser.handle(userData);

      expect(response.ok).toBeFalsy();
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("User already registered with this email");
      expect(response.errors[0].status).toBe("USER_ALREADY_REGISTERED");
      expect(response.data).toBe(null);
    });
  });
});

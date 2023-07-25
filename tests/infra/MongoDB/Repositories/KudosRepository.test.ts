import { Database } from "@/infra/MongoDB/services/Database";
import { ObjectId } from "mongodb";
import KudosEntity, { Status } from "@/domain/Kudos/Entities/Kudos";
import KudosRepository from "@/infra/MongoDB/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import { Collection } from "@/infra/MongoDB/services/Collection";
import { Kudos as KudosModel } from "@/infra/MongoDB/models/Kudos";

describe("KudosRepository", () => {
  let kudosRepository: KudosRepository;
  let databaseMock: Database;
  let kudosCollection: Collection<KudosModel>;

  beforeEach(() => {
    kudosCollection = {
      insertOne: jest.fn().mockResolvedValue({ _id: "kudosId" }),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      archive: jest.fn(),
    } as Partial<Collection<KudosModel>> as Collection<KudosModel>;

    databaseMock = {
      connect: jest.fn(),
      getCollection: jest.fn().mockResolvedValue(kudosCollection),
    } as Partial<Database> as Database;

    kudosRepository = new KudosRepository(databaseMock);
  });

  describe("create", () => {
    it("should create a kudos in the database", async () => {
      const now = new Date();
      const kudosData: KudosData = {
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        panelSlug: "panel-slug",
        from: { name: "John Doe", id: "user-1" },
        to: "Other Person",
        createdAt: now,
        updatedAt: now,
        status: Status.ACTIVE,
      };

      const createdKudos = await kudosRepository.create(kudosData);

      expect(databaseMock.connect).toHaveBeenCalled();
      expect(databaseMock.getCollection).toHaveBeenCalledWith("kudos");
      expect(kudosCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: kudosData.slug,
          title: kudosData.title,
          from: kudosData.from,
          status: Status.ACTIVE,
          createdAt: now,
        }),
      );

      expect(createdKudos.slug).toBe(kudosData.slug);
      expect(createdKudos.title).toBe(kudosData.title);
    });

    it("should throw an error if kudos creation fails", async () => {
      const now = new Date();
      const kudosData: KudosData = {
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        panelSlug: "panel-slug",
        from: { name: "John Doe", id: "user-1" },
        to: "Other Person",
        createdAt: now,
        updatedAt: now,
        status: Status.ACTIVE,
      };

      jest
        .spyOn(kudosCollection, "insertOne")
        .mockImplementationOnce(
          async () =>
            new KudosModel(
              kudosData.slug ?? "",
              kudosData.panelSlug ?? "",
              kudosData.title,
              kudosData.description,
              kudosData.from,
              kudosData.to,
              now,
              now,
              Status.ACTIVE,
            ),
        );

      await expect(kudosRepository.create(kudosData)).rejects.toThrow("Error creating kudos on database");
    });
  });

  describe("update", () => {
    it("should update an existing kudos correctly", async () => {
      const now = new Date();
      const kudosData: KudosData = {
        title: "Test Kudos",
        description: "Test Kudos Description",
        slug: "test-kudos",
        panelSlug: "panel-slug",
        from: { name: "John Doe", id: "user-1" },
        to: "Other Person",
        createdAt: now,
        updatedAt: now,
        status: Status.ACTIVE,
      };

      const updatedKudosData: KudosData = {
        from: { id: "user-1", name: "Name" },
        title: "Test Kudos Updated",
      } as KudosData;

      jest
        .spyOn(kudosCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new KudosModel(
              kudosData.slug ?? "",
              kudosData.panelSlug ?? "",
              kudosData.title,
              kudosData.description,
              kudosData.from,
              kudosData.to,
              now,
              now,
              Status.ACTIVE,
              new ObjectId(),
            ),
        );

      jest
        .spyOn(kudosCollection, "update")
        .mockImplementationOnce(
          async () =>
            new KudosModel(
              kudosData.slug ?? "",
              kudosData.panelSlug ?? "",
              kudosData.title,
              kudosData.description,
              kudosData.from,
              kudosData.to,
              now,
              now,
              Status.ACTIVE,
            ),
        );

      const updatedKudos = await kudosRepository.update({
        slug: "test-kudos",
        kudosData: updatedKudosData,
      });

      expect(updatedKudos?.title).toBe(updatedKudosData.title);
    });

    it("should return null when trying to update an non existing kudos", async () => {
      const updatedKudosData: KudosData = {
        from: { id: "user-1", name: "Name" },
        title: "Test Kudos Updated",
      } as KudosData;

      jest.spyOn(kudosCollection, "findFirst").mockImplementationOnce(async () => null);

      const updatedKudos = await kudosRepository.update({
        slug: "test-kudos",
        kudosData: updatedKudosData,
      });

      expect(updatedKudos).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing kudos correctly", async () => {
      jest
        .spyOn(kudosCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new KudosModel(
              "kudos-slug",
              "panel-slug",
              "Test Kudos",
              "Description Kudos",
              { id: "user-id", name: "Person Name" },
              "Other Person Name",
              new Date(),
              new Date(),
              Status.ACTIVE,
              new ObjectId(),
            ),
        );

      jest.spyOn(kudosCollection, "delete").mockImplementationOnce(async () => true);

      const operationResult = await kudosRepository.delete("kudos-slug");

      expect(operationResult).toBeTruthy();
    });

    it("should return true when trying to delete an non existing kudos", async () => {
      jest.spyOn(kudosCollection, "findFirst").mockImplementationOnce(async () => null);

      const operationResult = await kudosRepository.delete("kudos-slug");

      expect(operationResult).toBeTruthy();
    });
  });

  describe("archive", () => {
    it("should archive an existing kudos correctly", async () => {
      const kudosModel = new KudosModel(
        "kudos-slug",
        "panel-slug",
        "Test Kudos",
        "Description Kudos",
        { id: "user-id", name: "From Name" },
        "To Name",
        new Date(),
        new Date(),
        Status.ACTIVE,
        new ObjectId(),
      );

      jest.spyOn(kudosCollection, "findFirst").mockImplementationOnce(async () => kudosModel);

      await kudosRepository.archive("kudos-slug");

      expect(kudosCollection.update).toHaveBeenCalledWith(kudosModel._id, {
        status: Status.ARCHIVED,
      });
    });

    it("should return false when trying to archive an non existing kudos", async () => {
      jest.spyOn(kudosCollection, "findFirst").mockImplementationOnce(async () => null);

      const operationResult = await kudosRepository.archive("kudos-slug");

      expect(operationResult).toBeFalsy();
    });
  });

  describe("findBySlug", () => {
    it("should return a kudos if it exists", async () => {
      const now = new Date();

      const kudosData: KudosData = {
        slug: "test-kudos",
        panelSlug: "panel-slug",
        title: "Test Kudos",
        description: "Description Kudos",
        from: { id: "user-id", name: "John Doe" },
        to: "To Name",
        createdAt: now,
        updatedAt: now,
        status: Status.ACTIVE,
      } as KudosData;

      jest
        .spyOn(kudosCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new KudosModel(
              kudosData.slug ?? "",
              kudosData.panelSlug ?? "",
              kudosData.title,
              kudosData.description,
              kudosData.from,
              kudosData.to,
              now,
              now,
              Status.ACTIVE,
              new ObjectId(),
            ),
        );

      const kudos = await kudosRepository.findBySlug("test-kudos");

      expect(kudos).toBeInstanceOf(KudosEntity);
      expect(kudos?.slug).toBe(kudosData.slug);
      expect(kudos?.title).toBe(kudosData.title);
    });

    it("should return null if kudos does not exist", async () => {
      jest.spyOn(kudosCollection, "findFirst").mockImplementationOnce(async () => null);

      const kudos = await kudosRepository.findBySlug("test-kudos");

      expect(kudos).toBeNull();
    });
  });
});

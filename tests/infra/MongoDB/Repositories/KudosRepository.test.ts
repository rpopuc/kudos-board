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
});

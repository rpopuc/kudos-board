import { Database } from "@/infra/MongoDB/services/Database";
import { ObjectId } from "mongodb";
import PanelEntity, { Status } from "@/domain/Panel/Entities/Panel";
import PanelRepository from "@/infra/MongoDB/Repositories/PanelRepository";
import PanelData from "@/domain/Panel/DTO/PanelData";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import { Collection } from "@/infra/MongoDB/services/Collection";
import { Panel as PanelModel } from "@/infra/MongoDB/models/Panel";

describe("PanelRepository", () => {
  let panelRepository: PanelRepository;
  let databaseMock: Database;
  let panelCollection: Collection<PanelModel>;

  beforeEach(() => {
    panelCollection = {
      insertOne: jest.fn().mockResolvedValue({ _id: "panelId" }),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      archive: jest.fn(),
    } as Partial<Collection<PanelModel>> as Collection<PanelModel>;

    databaseMock = {
      connect: jest.fn(),
      getCollection: jest.fn().mockResolvedValue(panelCollection),
    } as Partial<Database> as Database;

    panelRepository = new PanelRepository(databaseMock);
  });

  describe("create", () => {
    it("should create a panel in the database", async () => {
      const now = new Date();
      const panelData = {
        title: "Test Panel",
        slug: "test-panel",
        owner: "John Doe",
        password: new PlainTextPassword("panelPassword"),
        clientPassword: new PlainTextPassword("clientPassword"),
        createdAt: now,
        updatedAt: now,
        status: Status.ACTIVE,
      } as PanelData;

      const createdPanel = await panelRepository.create(panelData);

      expect(databaseMock.connect).toHaveBeenCalled();
      expect(databaseMock.getCollection).toHaveBeenCalledWith("panels");
      expect(panelCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: panelData.slug,
          title: panelData.title,
          owner: panelData.owner,
          password: panelData.password.getValue(),
          clientPassword: panelData.clientPassword?.getValue(),
          status: Status.ACTIVE,
          createdAt: now,
          updatedAt: now,
        }),
      );

      expect(createdPanel.slug).toBe(panelData.slug);
      expect(createdPanel.title).toBe(panelData.title);
    });

    it("should throw an error if panel creation fails", async () => {
      const panelData = {
        slug: "test-panel",
        title: "Test Panel",
        owner: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: new PlainTextPassword("panelPassword"),
        status: Status.ACTIVE,
      } as PanelData;

      jest
        .spyOn(panelCollection, "insertOne")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
            ),
        );

      await expect(panelRepository.create(panelData)).rejects.toThrow("Error creating panel on database");
    });
  });

  describe("findBySlug", () => {
    it("should return a panel if it exists", async () => {
      const panelData: PanelData = {
        slug: "test-panel",
        title: "Test Panel",
        owner: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: new PlainTextPassword("panelPassword"),
        status: Status.ACTIVE,
      } as PanelData;

      jest
        .spyOn(panelCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
            ),
        );

      const panel = await panelRepository.findBySlug("test-panel");

      expect(panel).toBeInstanceOf(PanelEntity);
      expect(panel?.slug).toBe(panelData.slug);
      expect(panel?.title).toBe(panelData.title);
    });

    it("should return a panel with clientPassword if it exists", async () => {
      const panelData: PanelData = {
        slug: "test-panel",
        title: "Test Panel",
        owner: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: new PlainTextPassword("panelPassword"),
        clientPassword: new PlainTextPassword("clientPassword"),
        status: Status.ACTIVE,
      } as PanelData;

      jest
        .spyOn(panelCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
              panelData.clientPassword?.getValue(),
            ),
        );

      const panel = await panelRepository.findBySlug("test-panel");

      expect(panel).toBeInstanceOf(PanelEntity);
      expect(panel?.slug).toBe(panelData.slug);
      expect(panel?.title).toBe(panelData.title);
      expect(panel?.clientPassword?.getValue()).toBe(panelData.clientPassword?.getValue());
    });

    it("should return null if panel does not exist", async () => {
      jest.spyOn(panelCollection, "findFirst").mockImplementationOnce(async () => null);

      const panel = await panelRepository.findBySlug("test-panel");

      expect(panel).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing panel correctly", async () => {
      const panelData: PanelData = {
        slug: "test-panel",
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const updatedPanelData: PanelData = {
        owner: "123",
        title: "Test Panel Updated",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      jest
        .spyOn(panelCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
              undefined,
              new ObjectId(),
            ),
        );

      jest
        .spyOn(panelCollection, "update")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
            ),
        );

      const updatedPanel = await panelRepository.update({
        slug: "panel-slug",
        panelData: updatedPanelData,
      });

      expect(updatedPanel?.title).toBe(updatedPanelData.title);
    });

    it("should update an existing panel correctly with clientPassword", async () => {
      const panelData: PanelData = {
        slug: "test-panel",
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
        clientPassword: new PlainTextPassword("teste12345"),
      } as PanelData;

      const updatedPanelData: PanelData = {
        owner: "123",
        title: "Test Panel Updated",
        password: new PlainTextPassword("teste12345"),
        clientPassword: new PlainTextPassword("teste12345"),
      } as PanelData;

      jest
        .spyOn(panelCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
              panelData.clientPassword?.getValue(),
              new ObjectId(),
            ),
        );

      jest
        .spyOn(panelCollection, "update")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              panelData.slug ?? "",
              panelData.title,
              panelData.owner,
              new Date(),
              new Date(),
              panelData.password.getValue(),
              Status.ACTIVE,
              panelData.clientPassword?.getValue(),
            ),
        );

      const updatedPanel = await panelRepository.update({
        slug: "panel-slug",
        panelData: updatedPanelData,
      });

      expect(updatedPanel?.title).toBe(updatedPanelData.title);
    });

    it("should return null when trying to update an non existing panel", async () => {
      const panelData: PanelData = {
        slug: "test-panel",
        owner: "123",
        title: "Test Panel",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      const updatedPanelData: PanelData = {
        owner: "123",
        title: "Test Panel Updated",
        password: new PlainTextPassword("teste12345"),
      } as PanelData;

      jest.spyOn(panelCollection, "findFirst").mockImplementationOnce(async () => null);

      const updatedPanel = await panelRepository.update({
        slug: "panel-slug",
        panelData: updatedPanelData,
      });

      expect(updatedPanel).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing panel correctly", async () => {
      jest
        .spyOn(panelCollection, "findFirst")
        .mockImplementationOnce(
          async () =>
            new PanelModel(
              "panel-slug",
              "Test Panel",
              "123",
              new Date(),
              new Date(),
              "teste12345",
              Status.ACTIVE,
              undefined,
              new ObjectId(),
            ),
        );

      jest.spyOn(panelCollection, "delete").mockImplementationOnce(async () => true);

      const operationResult = await panelRepository.delete("panel-slug");

      expect(operationResult).toBeTruthy();
    });

    it("should return true when trying to delete an non existing panel", async () => {
      jest.spyOn(panelCollection, "findFirst").mockImplementationOnce(async () => null);

      const operationResult = await panelRepository.delete("panel-slug");

      expect(operationResult).toBeTruthy();
    });
  });

  describe("archive", () => {
    it("should archive an existing panel correctly", async () => {
      const panelModel = new PanelModel(
        "panel-slug",
        "Test Panel",
        "123",
        new Date(),
        new Date(),
        "teste12345",
        Status.ACTIVE,
        undefined,
        new ObjectId(),
      );

      jest.spyOn(panelCollection, "findFirst").mockImplementationOnce(async () => panelModel);

      await panelRepository.archive("panel-slug");

      expect(panelCollection.update).toHaveBeenCalledWith(panelModel._id, {
        status: Status.ARCHIVED,
      });
    });

    it("should return false when trying to archive an non existing panel", async () => {
      jest.spyOn(panelCollection, "findFirst").mockImplementationOnce(async () => null);

      const operationResult = await panelRepository.archive("panel-slug");

      expect(operationResult).toBeFalsy();
    });
  });
});

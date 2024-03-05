import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import KudosData from "@/domain/Kudos/DTO/KudosData";

describe("CreateKudos", () => {
  describe("handle", () => {
    let repositoryMock: Repository;
    let createKudos: CreateKudos;

    beforeEach(() => {
      repositoryMock = {
        create: jest.fn().mockImplementation((kudosData: KudosData) => {
          return Promise.resolve({
            slug: "123",
            panelSlug: kudosData.panelSlug,
            title: kudosData.title,
            description: kudosData.description,
            from: kudosData.from,
            to: kudosData.to,
          });
        }),
        update: jest.fn(),
        archive: jest.fn(),
        delete: jest.fn(),
        findBySlug: jest.fn(),
        findByPanelSlug: jest.fn(),
      } as Repository;

      createKudos = new CreateKudos(repositoryMock);
    });

    it("should return a new kudos entity with the correct data", async () => {
      const from = { id: "user-1", name: "User 1" };

      const kudosData = {
        title: "Example Title",
        description: "Example Description",
        from,
        to: "User 2",
        panelSlug: "panel-slug-1",
      } as KudosData;

      const kudosEntity = new KudosEntity(kudosData);

      const kudosRepository = {
        create: jest.fn().mockReturnValue(kudosEntity),
        archive: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findBySlug: jest.fn(),
        findByPanelSlug: jest.fn(),
      } as Repository;

      const createKudos = new CreateKudos(kudosRepository);
      const response = await createKudos.handle(kudosData);

      expect(kudosRepository.create).toHaveBeenCalledTimes(1);
      expect(kudosRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: kudosData.title,
          description: kudosData.description,
          from: kudosData.from,
          to: kudosData.to,
          panelSlug: kudosData.panelSlug,
        }),
      );
      expect(response.data).toStrictEqual(kudosEntity);
    });

    it("should return an error if title is missing", async () => {
      const from = { id: "user-1", name: "User 1" };

      const invalidkudosData = {
        title: "",
        description: "Example Description",
        from,
        to: "User 2",
        panelSlug: "panel-slug-1",
      } as KudosData;

      const response = await createKudos.handle(invalidkudosData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have title");
      expect(response.errors[0].status).toBe("EMPTY_TITLE");
      expect(response.data).toBe(null);
    });

    it("should return an error if owner is missing", async () => {
      const invalidkudosData = {
        title: "Example Title",
        description: "Example Description",
        from: {},
        to: "User 2",
        panelSlug: "panel-slug-1",
      } as KudosData;

      const response = await createKudos.handle(invalidkudosData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have owner");
      expect(response.errors[0].status).toBe("EMPTY_OWNER");
      expect(response.data).toBe(null);
    });

    it("should return an error if description is missing", async () => {
      const from = { id: "user-1", name: "User 1" };

      const invalidKudosData = {
        title: "Example Title",
        description: "",
        from,
        to: "User 2",
        panelSlug: "panel-slug-1",
      } as KudosData;

      const response = await createKudos.handle(invalidKudosData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have description");
      expect(response.errors[0].status).toBe("EMPTY_DESCRIPTION");
      expect(response.data).toBe(null);
    });

    it("should return an error if recipient is missing", async () => {
      const from = { id: "user-1", name: "User 1" };

      const invalidKudosData = {
        title: "Example Title",
        description: "Example Description",
        from,
        to: "",
        panelSlug: "panel-slug-1",
      } as KudosData;

      const response = await createKudos.handle(invalidKudosData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have recipient");
      expect(response.errors[0].status).toBe("EMPTY_RECIPIENT");
      expect(response.data).toBe(null);
    });

    it("should return an error if panel slug is missing", async () => {
      const from = { id: "user-1", name: "User 1" };

      const invalidKudosData = {
        title: "Example Title",
        description: "Example Description",
        from,
        to: "User 2",
        panelSlug: "",
      } as KudosData;

      const response = await createKudos.handle(invalidKudosData);
      expect(response.ok).toBe(false);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].message).toBe("Does not have panel slug");
      expect(response.errors[0].status).toBe("EMPTY_PANEL_SLUG");
      expect(response.data).toBe(null);
    });
  });
});

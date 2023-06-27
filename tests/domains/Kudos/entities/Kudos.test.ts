import Kudos, { Status } from "@/domain/Kudos/Entities/Kudos";

describe("Kudos", () => {
  describe("constructor", () => {
    it("should initialize the properties correctly when valid data is provided", () => {
      const from = { id: "user-1", name: "User 1" };

      const data = {
        panelSlug: "panel-slug",
        title: "Example Title",
        description: "Example Description",
        from,
        to: "User 2",
        createdAt: "2022-04-19",
      };

      const kudos = new Kudos(data);

      expect(kudos.title).toEqual(data.title);
      expect(kudos.description).toEqual(data.description);
      expect(kudos.slug).not.toBeUndefined();
      expect(kudos.panelSlug).toEqual(data.panelSlug);
      expect(kudos.from).toMatchObject(data.from);
      expect(kudos.to).toEqual(data.to);
      expect(kudos.createdAt).toEqual(data.createdAt);
      expect(kudos.status).toBe(Status.ACTIVE);
    });

    it("should initialize the slug randomly", () => {
      const from = { id: "user-1", name: "User 1" };

      const data = {
        panelSlug: "panel-slug",
        title: "Example Title",
        description: "Example Description",
        from,
        to: "User 2",
        createdAt: "2022-04-19",
      };

      const kudosOne = new Kudos(data);
      const kudosTwo = new Kudos(data);

      expect(kudosOne.slug).not.toBeUndefined();
      expect(kudosTwo.slug).not.toBeUndefined();
      expect(kudosOne.slug).not.toEqual(kudosTwo.slug);
    });
  });
});

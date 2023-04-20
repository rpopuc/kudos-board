import Panel from "../../../src/domains/entities/Panel";

describe("Panel", () => {
  describe("constructor", () => {
    it("should initialize the properties correctly when valid data is provided", () => {
      const data = {
        title: "Example Title",
        slug: "example-slug",
        owner: "Example Owner",
        createdAt: "2022-04-19",
      };

      const panel = new Panel(data);

      expect(panel.title).toEqual(data.title);
      expect(panel.slug).toEqual(data.slug);
      expect(panel.owner).toEqual(data.owner);
      expect(panel.createdAt).toEqual(data.createdAt);
    });

    it("should initialize the properties correctly when no data is provided", () => {
      const panel = new Panel(null);

      expect(panel.title).toBeUndefined();
      expect(panel.slug).toBeUndefined();
      expect(panel.owner).toBeUndefined();
      expect(panel.createdAt).toBeUndefined();
    });
  });
});

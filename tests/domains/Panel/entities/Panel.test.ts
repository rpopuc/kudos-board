import Panel from "../../../../src/domains/Panel/Entities/Panel";

describe("Panel", () => {
  describe("constructor", () => {
    it("should initialize the properties correctly when valid data is provided", () => {
      const data = {
        title: "Example Title",
        owner: "Example Owner",
        createdAt: "2022-04-19",
      };

      const panel = new Panel(data);

      expect(panel.title).toEqual(data.title);
      expect(panel.slug).not.toBeUndefined();
      expect(panel.owner).toEqual(data.owner);
      expect(panel.createdAt).toEqual(data.createdAt);
    });
  });
});

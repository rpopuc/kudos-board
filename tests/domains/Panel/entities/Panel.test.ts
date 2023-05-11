import Panel from "@/domains/Panel/Entities/Panel";

describe("Panel", () => {
  describe("constructor", () => {
    it("should initialize the properties correctly when valid data is provided", () => {
      const data = {
        title: "Example Title",
        owner: "Example Owner",
        createdAt: "2022-04-19",
        password: "teste12345",
      };

      const panel = new Panel(data);

      expect(panel.title).toEqual(data.title);
      expect(panel.slug).not.toBeUndefined();
      expect(panel.owner).toEqual(data.owner);
      expect(panel.createdAt).toEqual(data.createdAt);
    });

    it("should initialize the slug randomly", () => {
      const data = {
        title: "Example Title",
        owner: "Example Owner",
        createdAt: "2022-04-19",
        password: "teste12345",
      };

      const panelOne = new Panel(data);
      const panelTwo = new Panel(data);

      expect(panelOne.slug).not.toBeUndefined();
      expect(panelTwo.slug).not.toBeUndefined();
      expect(panelOne.slug).not.toEqual(panelTwo.slug);
    });
  });
});

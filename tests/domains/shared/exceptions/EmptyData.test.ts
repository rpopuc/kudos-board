import EmptyData from "@/domains/shared/exceptions/EmptyData";
import Error from "@/domains/shared/exceptions/BusinessError";

describe("EmptyData", () => {
  it("should create an instance of Error", () => {
    const emptyData = new EmptyData("400", "name", "custom message");

    expect(emptyData).toBeInstanceOf(Error);
  });

  it("should format an Error message", () => {
    const emptyData = new EmptyData("400", "name");

    expect(emptyData.message).toBe("Does not have name");
  });
});

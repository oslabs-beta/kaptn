import helpDesk from "../../src/components/HelpDesk";
import "@testing-library/jest-dom";

describe("HelpDesk data", () => {
  it("exports an object", () => {
    expect(typeof helpDesk).toBe("object");
    expect(helpDesk).not.toBeNull();
  });

  it("contains kubectl command entries", () => {
    expect(helpDesk).toHaveProperty("create");
    expect(helpDesk).toHaveProperty("get");
    expect(helpDesk).toHaveProperty("delete");
    expect(helpDesk).toHaveProperty("apply");
    expect(helpDesk).toHaveProperty("describe");
  });

  it("has string values for all entries", () => {
    Object.entries(helpDesk).forEach(([key, value]) => {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it("create entry contains usage examples", () => {
    expect(helpDesk.create).toContain("kubectl create");
    expect(helpDesk.create).toContain("Examples");
  });
});

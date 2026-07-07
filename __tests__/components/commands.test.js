import commands from "../../src/components/commands";
import "@testing-library/jest-dom";

describe("commands data", () => {
  it("exports an array of command objects", () => {
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
  });

  it("each command has a title and category", () => {
    commands.forEach((cmd) => {
      expect(cmd).toHaveProperty("title");
      expect(cmd).toHaveProperty("category");
      expect(typeof cmd.title).toBe("string");
      expect(typeof cmd.category).toBe("string");
    });
  });

  it("contains expected categories", () => {
    const categories = [...new Set(commands.map((c) => c.category))];
    expect(categories).toContain("Beginners Commands");
    expect(categories).toContain("Intermediate Commands");
    expect(categories).toContain("Deploy Commands");
    expect(categories).toContain("Cluster Management Commands");
    expect(categories).toContain("Troubleshoot/Debug Commands");
    expect(categories).toContain("Advanced Commands");
    expect(categories).toContain("Settings Commands");
    expect(categories).toContain("Other Commands");
  });

  it("contains core kubectl commands", () => {
    const titles = commands.map((c) => c.title);
    expect(titles).toContain("create");
    expect(titles).toContain("get");
    expect(titles).toContain("delete");
    expect(titles).toContain("apply");
    expect(titles).toContain("logs");
    expect(titles).toContain("describe");
    expect(titles).toContain("scale");
  });

  it("has no duplicate command titles", () => {
    const titles = commands.map((c) => c.title);
    const uniqueTitles = [...new Set(titles)];
    expect(titles.length).toBe(uniqueTitles.length);
  });
});

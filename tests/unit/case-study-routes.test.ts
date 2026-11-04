import { readdirSync } from "node:fs";
import { join } from "node:path";
import { facts } from "@/content/facts";

describe("case-study routes", () => {
  it("has exactly one static route per project", () => {
    const routes = readdirSync(join(process.cwd(), "src/app/work"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(routes).toEqual(facts.projects.map((project) => project.slug).sort());
  });
});

import { facts, rawFacts } from "@/content/facts";
import { factsSchema, SKILL_GROUPS } from "@/content/schema";

describe("facts.ts", () => {
  it("parses against the schema", () => {
    expect(factsSchema.safeParse(rawFacts).success).toBe(true);
  });

  it("keeps the skill groups in the agreed order", () => {
    expect(facts.skills.map((skill) => skill.group)).toEqual([...SKILL_GROUPS]);
  });

  it("never stores a phone number", () => {
    const serialized = JSON.stringify(rawFacts);
    expect(serialized).not.toMatch(/(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)/);
    expect(serialized).not.toContain("tel:");
  });

  it("only uses count-up targets that match the displayed value", () => {
    const metrics = [
      ...facts.projects.flatMap((project) => project.metrics),
      ...facts.experience.flatMap((job) => job.metrics),
    ];
    for (const metric of metrics) {
      if (metric.countTo === undefined) continue;
      expect(metric.display).toContain(String(metric.countTo));
    }
  });
});

import { rawFacts } from "@/content/facts";
import { TODO_CONFIRM } from "@/content/schema";

/** Runs only in the ship gate (`pnpm test:ship`): every TODO(confirm) must be resolved by then. */
describe.runIf(process.env.SHIP === "1")("ship gate", () => {
  it("has no TODO(confirm) left in facts.ts", () => {
    expect(JSON.stringify(rawFacts)).not.toContain(TODO_CONFIRM);
  });
});

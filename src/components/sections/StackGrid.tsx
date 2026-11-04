import { ChipList } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { facts } from "@/content/facts";

export function StackGrid() {
  return (
    <Section id="skills" title="Tech stack">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {facts.skills.map(({ group, items }) => (
          <div key={group}>
            <h3 className="font-sans text-body font-medium tracking-normal">{group}</h3>
            <ChipList label={group} items={items} className="mt-3" />
          </div>
        ))}
      </div>
    </Section>
  );
}

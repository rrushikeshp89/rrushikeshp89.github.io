import { facts } from "@/content/facts";

export default function HomePage() {
  const { name, headline, objective } = facts.identity;

  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-5xl leading-tight">{name}</h1>
      <p className="mt-6 text-2xl">{headline}</p>
      <p className="mt-6 max-w-[68ch] text-ink-muted">{objective}</p>
    </main>
  );
}

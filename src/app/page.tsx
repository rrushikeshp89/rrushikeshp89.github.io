import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Credentials } from "@/components/sections/Credentials";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { StackGrid } from "@/components/sections/StackGrid";

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <SelectedWork />
      <Approach />
      <Experience />
      <StackGrid />
      <Credentials />
      <Contact />
    </main>
  );
}

import { TemplateFilters } from "@/components/templates/template-filters";
import { discoverTemplates } from "@/lib/templates";

export default async function Home() {
  const templates = await discoverTemplates();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Private Library</p>
        <h1 className="mt-3 text-4xl font-semibold">Templates Portfolio</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Capture, reconstruct, QA, and prepare template concepts for later commercialization.
        </p>
      </header>
      <TemplateFilters templates={templates} />
    </main>
  );
}

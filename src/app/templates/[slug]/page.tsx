import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/templates/status-badge";
import { getTemplateBySlug } from "@/lib/templates";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  const panels = [
    ["Source Reference", template.sourceUrl],
    ["Design Extraction", `templates/${template.id}/design`],
    ["Reconstructed App", `templates/${template.id}/app`],
    ["QA", `templates/${template.id}/qa`],
  ] as const;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Templates Portfolio</a>

      <header className="mt-6 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
          <h1 className="mt-2 text-4xl font-semibold">{template.name}</h1>
          <p className="mt-3 text-muted-foreground">Motion: {template.motionLevel}</p>
        </div>
        <StatusBadge status={template.status} />
      </header>

      <section className="grid gap-4 py-8 md:grid-cols-2">
        {panels.map(([title, value]) => (
          <article key={title} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{title}</h2>
            {title === "Source Reference" ? (
              <a href={template.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm text-muted-foreground hover:text-foreground">
                {value}
              </a>
            ) : (
              <p className="mt-3 break-all font-mono text-sm text-muted-foreground">{value}</p>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl border p-5">
        <h2 className="font-semibold">Commercialization Readiness</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-muted-foreground">Commercial ready</dt><dd>{template.commercialReady ? "Yes" : "No"}</dd></div>
          <div><dt className="text-muted-foreground">Source brand removed</dt><dd>{template.sourceBrandRemoved ? "Yes" : "No"}</dd></div>
          <div><dt className="text-muted-foreground">QA passed</dt><dd>{template.qaPassed ? "Yes" : "No"}</dd></div>
        </dl>
      </section>
    </main>
  );
}

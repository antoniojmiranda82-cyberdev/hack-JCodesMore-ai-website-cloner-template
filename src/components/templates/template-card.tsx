import { StatusBadge } from "@/components/templates/status-badge";
import type { TemplateMetadata } from "@/types/template";

export function TemplateCard({ template }: { template: TemplateMetadata }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <a className="text-xl font-semibold hover:underline" href={`/templates/${template.id}`}>
            {template.name}
          </a>
          <p className="mt-1 text-sm text-muted-foreground">Motion: {template.motionLevel}</p>
        </div>
        <StatusBadge status={template.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {template.category.map((category) => (
          <span key={category} className="rounded-full bg-muted px-2.5 py-1 text-xs">
            {category}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {template.stack.map((item) => (
          <span key={item} className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <a href={template.sourceUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
          Source reference
        </a>
        <span>{template.commercialReady ? "Commercial ready" : "Internal only"}</span>
      </div>
    </article>
  );
}

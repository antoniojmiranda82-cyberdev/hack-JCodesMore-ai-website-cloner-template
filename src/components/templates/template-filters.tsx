"use client";

import { useMemo, useState } from "react";
import { TemplateCard } from "@/components/templates/template-card";
import type { TemplateMetadata, TemplateStatus } from "@/types/template";

export function TemplateFilters({ templates }: { templates: TemplateMetadata[] }) {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | TemplateStatus>("all");
  const [commercial, setCommercial] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(templates.flatMap((template) => template.category))).sort(),
    [templates],
  );

  const statuses = useMemo(
    () => Array.from(new Set(templates.map((template) => template.status))).sort(),
    [templates],
  );

  const filtered = templates.filter((template) => {
    const categoryMatch = category === "all" || template.category.includes(category);
    const statusMatch = status === "all" || template.status === status;
    const commercialMatch =
      commercial === "all" ||
      (commercial === "ready" && template.commercialReady) ||
      (commercial === "internal" && !template.commercialReady);
    return categoryMatch && statusMatch && commercialMatch;
  });

  return (
    <section>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-sm">
          <span className="text-muted-foreground">Category</span>
          <select aria-label="Category" className="rounded-lg border bg-background px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <select aria-label="Status" className="rounded-lg border bg-background px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as "all" | TemplateStatus)}>
            <option value="all">All</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-muted-foreground">Commercial</span>
          <select aria-label="Commercial" className="rounded-lg border bg-background px-3 py-2" value={commercial} onChange={(event) => setCommercial(event.target.value)}>
            <option value="all">All</option>
            <option value="internal">Internal only</option>
            <option value="ready">Commercial ready</option>
          </select>
        </label>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => <TemplateCard key={template.id} template={template} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">No templates match these filters.</p>
      )}
    </section>
  );
}

import type { TemplateStatus } from "@/types/template";

export function StatusBadge({ status }: { status: TemplateStatus }) {
  return (
    <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide">
      {status}
    </span>
  );
}

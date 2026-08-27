import type { TemplateChapter } from "./content";

export function EditorialChapter({
  chapter,
  index,
}: {
  chapter: TemplateChapter;
  index: number;
}) {
  return (
    <section
      id={chapter.id}
      className="ai-chapter"
      data-chapter-index={index}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="ai-chapter-copy">
        <p className="ai-chapter-number">{chapter.number}</p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <p className="ai-chapter-lead">{chapter.body}</p>
        <p className="ai-chapter-detail">{chapter.detail}</p>
      </div>
    </section>
  );
}

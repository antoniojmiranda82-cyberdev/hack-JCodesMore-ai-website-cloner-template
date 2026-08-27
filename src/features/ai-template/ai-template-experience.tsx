import Script from "next/script";
import { AIScene } from "./ai-scene";
import { AI_TEMPLATE_CONTENT } from "./content";
import { EditorialChapter } from "./editorial-chapter";
import "./ai-template.css";

export function AITemplateExperience({ forceStatic = false }: { forceStatic?: boolean }) {
  return (
    <main className="ai-template-root" data-ai-template data-scene={forceStatic ? "static" : "loading"}>
      {!forceStatic ? (
        <>
          <Script
            src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"
            strategy="afterInteractive"
          />
          <Script
            src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"
            strategy="afterInteractive"
          />
          <Script src="/ai-template-runtime.js" strategy="afterInteractive" />
        </>
      ) : null}

      <AIScene />
      <div className="ai-vignette" aria-hidden="true" />

      <header className="ai-topbar">
        <a className="ai-brand" href="#approach" aria-label={`${AI_TEMPLATE_CONTENT.companyName} home`}>
          {AI_TEMPLATE_CONTENT.companyName}
        </a>
        <nav aria-label="Chapter navigation">
          {AI_TEMPLATE_CONTENT.chapters.map((chapter) => (
            <a key={chapter.id} href={`#${chapter.id}`} aria-label={chapter.title} />
          ))}
        </nav>
      </header>

      <div className="ai-opening-copy">
        <p>{AI_TEMPLATE_CONTENT.promise}</p>
      </div>

      <div className="ai-chapters">
        {AI_TEMPLATE_CONTENT.chapters.map((chapter, index) => (
          <EditorialChapter key={chapter.id} chapter={chapter} index={index} />
        ))}
      </div>

      <footer id="contact" className="ai-ending">
        <p>Intelligence should feel less like software and more like momentum.</p>
        <a href={AI_TEMPLATE_CONTENT.primaryCta.href} className="ai-primary-cta">
          {AI_TEMPLATE_CONTENT.primaryCta.label}
        </a>
        <a id="architecture" href={AI_TEMPLATE_CONTENT.secondaryCta.href} className="ai-secondary-cta">
          {AI_TEMPLATE_CONTENT.secondaryCta.label}
        </a>
      </footer>

      <div className="ai-progress" aria-hidden="true">
        <span />
      </div>
    </main>
  );
}

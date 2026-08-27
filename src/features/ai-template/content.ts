export type TemplateChapter = {
  id: string;
  title: string;
  number: string;
  body: string;
  detail: string;
};

export const AI_TEMPLATE_CONTENT = {
  companyName: "AURELIS",
  promise: "Intelligence that moves with your world.",
  primaryCta: { label: "Enter the platform", href: "#contact" },
  secondaryCta: { label: "Read the architecture", href: "#architecture" },
  chapters: [
    {
      id: "approach",
      number: "I",
      title: "The Approach",
      body: "A new kind of intelligence begins before the threshold.",
      detail: "AURELIS gives teams a coordinated layer of agents that can reason, act, and adapt across the systems they already use.",
    },
    {
      id: "threshold",
      number: "II",
      title: "The Threshold",
      body: "Fragmented work becomes one continuous path.",
      detail: "Bring models, tools, data, approvals, and people into a single orchestration flow without replacing the stack beneath them.",
    },
    {
      id: "inner-ward",
      number: "III",
      title: "The Inner Ward",
      body: "Agents assemble around the work, not the other way around.",
      detail: "Compose specialized agents, hand off context between them, and keep every decision visible to the teams responsible for the outcome.",
    },
    {
      id: "keep",
      number: "IV",
      title: "The Keep",
      body: "Control lives at the center.",
      detail: "Policy boundaries, model routing, traceable actions, and human checkpoints make autonomy useful without turning governance into theater.",
    },
    {
      id: "watch",
      number: "V",
      title: "The Watch",
      body: "See further. Move sooner.",
      detail: "Launch a system that grows with your operation, from the first agent to a coordinated intelligence layer across the company.",
    },
  ] satisfies TemplateChapter[],
} as const;

export const AI_CHAPTERS = AI_TEMPLATE_CONTENT.chapters;

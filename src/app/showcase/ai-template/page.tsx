import type { Metadata } from "next";
import { AITemplateExperience } from "@/features/ai-template/ai-template-experience";

export const metadata: Metadata = {
  title: "AURELIS | Cinematic AI Template",
  description: "A five-chapter cinematic AI startup template with a live 3D night journey.",
};

export default function AITemplateShowcasePage() {
  return <AITemplateExperience />;
}

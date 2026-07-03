import { type FAQData } from "../types";

export const faqData: FAQData[] = [
  {
    id: "faq-replace-title",
    category: "Quickstart",
    question: "How do I replace the title and branding?",
    answer: "Open `src/data/heroData.ts` and edit the `title`, `highlightText`, and `subtitle` fields. All headings across the application are dynamically bound to this data file.",
  },
  {
    id: "faq-custom-spline",
    category: "3D Customization",
    question: "How do I link my own Spline 3D Scene?",
    answer: "Replace the Spline scene URL in `src/components/common/spline/SplineViewer.tsx` inside the default parameters of the component, or pass a new `sceneUrl` prop. If the URL cannot load, a beautiful custom interactive Canvas fallback will run automatically.",
  },
  {
    id: "faq-edit-prompts",
    category: "AI Integration",
    question: "Where are the AI presets and prompts configured?",
    answer: "Navigate to `src/data/promptPresets.ts`. You can add or modify system prompt strings and bind them to different Gemini models (e.g., `gemini-3.5-flash` or `gemini-3.1-pro-preview`).",
  },
  {
    id: "faq-change-colors",
    category: "Design System",
    question: "How do I change the global color scheme?",
    answer: "Open `src/index.css`. In Tailwind v4, global color design tokens are located in the `@theme` rule block (e.g. `--color-accent-base`). Editing these values instantly updates all Tailwind classes across the entire application.",
  },
];

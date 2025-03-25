export const MAccordionModes = ["single", "multiple"] as const;

export interface MTAccordion {
  mode: (typeof MAccordionModes)[number];
}

export interface MTAccordionItem {
  title: string;
  collapsed: boolean;
}

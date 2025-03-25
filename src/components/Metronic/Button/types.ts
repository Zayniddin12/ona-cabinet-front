export const MButtonColors = [
  "white",
  "primary",
  "light",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "dark",
] as const;

export const MButtonLightColors = [
  "primary",
  "success",
  "info",
  "warning",
  "danger",
  "dark",
] as const;

export const MButtonOutlineColors = [
  "default",
  "primary",
  "success",
  "info",
  "warning",
  "danger",
  "dark",
] as const;

export const MButtonHoverEffects = [
  "rise",
  "scale",
  "rotate-end",
  "rotate-start",
] as const;

export interface MTButton {
  variant?: (typeof MButtonColors)[number];
  hoverEffect?: (typeof MButtonHoverEffects)[number];
  light?: (typeof MButtonLightColors)[number];
  outline?: (typeof MButtonOutlineColors)[number];
  dashed?: (typeof MButtonOutlineColors)[number];
  flushed: boolean;
  link: boolean;
}

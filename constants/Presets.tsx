export const MODES = [
  {
    id: "romantic",
    title: "Romantic",
    subtitle: "Soft ink, flowing strokes, and poetic playback.",
    colors: ["#FF9A9E", "#FAD0C4"],
    darkColors: ["#de5d61", "#FAD0C4"],
    icon: "heart",
  },
  {
    id: "business",
    title: "Business",
    subtitle: "Structured memos, fast playback, and official seals.",
    colors: ["#F5F7FA", "#B8C6DB"], // Light yellow/silver vibe
    darkColors: ["#2C3E50", "#000000"],
    icon: "briefcase",
  },
  {
    id: "philosophy",
    title: "Philosophy",
    subtitle: "Deep ink, slow build, and permanent record.",
    colors: ["#4FACFE", "#00F2FE"],
    darkColors: ["#2C3E50", "#000000"],
    icon: "anchor",
  },
] as const;

export type PresetMode = (typeof MODES)[number]["id"];
export function isMode(value: string): value is PresetMode {
  return MODES.some((mode) => mode.id === value);
}

export function getMode(mode: string) {
  if (!isMode(mode)) return null;
  return MODES.find((m) => m.id === mode)!;
}

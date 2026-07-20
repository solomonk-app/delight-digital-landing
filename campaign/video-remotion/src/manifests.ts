import daysData from "./days.json";

export type Scene =
  | { type: "kinetic"; w: number; lines: string[]; serif?: boolean; size?: number }
  | { type: "chat"; w: number; eyebrow: string; prompt: string; answer: string; tone: "flat" | "good" }
  | { type: "chips"; w: number; title: string; items: string[]; mode: "pill" | "numbered" }
  | { type: "input"; w: number; label?: string; typed: string }
  | { type: "end"; w: number };

export type DayDef = { id: string; audio: string; wordsFile: string; cta: string; scenes: Scene[] };

// All 30 days live in days.json (data). Add/adjust videos there.
export const DAYS = daysData as unknown as DayDef[];

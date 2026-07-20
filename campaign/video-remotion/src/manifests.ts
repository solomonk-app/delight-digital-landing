export type Scene =
  | { type: "kinetic"; w: number; lines: string[]; serif?: boolean; size?: number }
  | { type: "chat"; w: number; eyebrow: string; prompt: string; answer: string; tone: "flat" | "good" }
  | { type: "chips"; w: number; title: string; items: string[]; mode: "pill" | "numbered" }
  | { type: "input"; w: number; label?: string; typed: string }
  | { type: "end"; w: number };

export type DayDef = { id: string; audio: string; wordsFile: string; cta: string; scenes: Scene[] };

export const DAYS: DayDef[] = [
  {
    id: "Day01",
    audio: "day-01.mp3",
    wordsFile: "day-01.words.json",
    cta: "Send this to someone who says they’re “too behind.”",
    scenes: [
      { type: "kinetic", w: 16, serif: true, lines: ["You’re not behind.", "You’re just *beginning.*"] },
      { type: "kinetic", w: 15, serif: true, lines: ["You don’t have to", "learn *everything.*"] },
      { type: "kinetic", w: 14, serif: true, lines: ["You don’t have to", "use it *every day.*"] },
      { type: "kinetic", w: 16, serif: true, lines: ["One real question", "is *enough.*"] },
      { type: "kinetic", w: 13, serif: true, lines: ["Beginning isn’t", "*being behind.*"] },
      { type: "end", w: 11 },
    ],
  },
  {
    id: "Day02",
    audio: "day-02.mp3",
    wordsFile: "day-02.words.json",
    cta: "Save this and try it today.",
    scenes: [
      { type: "kinetic", w: 15, lines: ["It’s not you.", "*It’s the prompt.*"] },
      { type: "chat", w: 18, eyebrow: "the boring way", prompt: "Plan a workout.", answer: "Sure — here’s a workout:\nWarm up, do some cardio,\nthen stretch. A few times a week.", tone: "flat" },
      { type: "chips", w: 17, title: "Five small *parts.*", items: ["Role", "Task", "Audience", "Format", "Tone"], mode: "pill" },
      { type: "chat", w: 32, eyebrow: "the useful way", prompt: "Act as a gentle physiotherapist. A 15-minute morning workout for someone at a desk with a sore lower back. A numbered list, one rest day, warm and reassuring.", answer: "1. Cat-cow — 2 min, loosen the lower back.\n2. Glute bridges — 10 slow reps.\n3. Standing hamstring reach.\n4. One rest day — that counts too.", tone: "good" },
      { type: "kinetic", w: 9, serif: true, lines: ["Same tool.", "*Better question.*"] },
      { type: "end", w: 9 },
    ],
  },
  {
    id: "Day03",
    audio: "day-03.mp3",
    wordsFile: "day-03.words.json",
    cta: "Save this for the next time you’re stuck.",
    scenes: [
      { type: "kinetic", w: 14, lines: ["Using AI well isn’t", "*complicated.*"] },
      { type: "chips", w: 54, title: "4 tiny *habits.*", items: ["Talk like a person", "Give it backstory", "Ask it to redo", "Verify what matters"], mode: "numbered" },
      { type: "kinetic", w: 17, serif: true, lines: ["Four habits.", "*That’s it.*"] },
      { type: "end", w: 15 },
    ],
  },
  {
    id: "Day04",
    audio: "day-04.mp3",
    wordsFile: "day-04.words.json",
    cta: "Share this with your group chat of fellow beginners.",
    scenes: [
      { type: "kinetic", w: 15, lines: ["5:00 · nobody", "planned *dinner.*"] },
      { type: "chat", w: 60, eyebrow: "hand it to AI", prompt: "I have [chicken, broccoli, rice, eggs] and about [30 min] to feed [a family of 4]. Suggest 3 simple dinners — mark the easiest one.", answer: "1. Sheet-pan chicken + broccoli — 30 min, one tray.\n2. Rice bowls — leftover veg, an egg on top.\n3. Tomato pasta — pantry staples, done in 20.\nStart with #1 if you’re worn out.", tone: "good" },
      { type: "kinetic", w: 12, serif: true, lines: ["Dinner, *sorted.*"] },
      { type: "end", w: 13 },
    ],
  },
  {
    id: "Day05",
    audio: "day-05.mp3",
    wordsFile: "day-05.words.json",
    cta: "Comment the task you’d want AI to help with — I’ll suggest a prompt.",
    scenes: [
      { type: "kinetic", w: 14, lines: ["…and you just", "stared at the *box?*"] },
      { type: "kinetic", w: 13, lines: ["There are", "*no magic words.*"] },
      { type: "input", w: 16, label: "type one real question", typed: "Explain this letter in plain English." },
      { type: "input", w: 14, typed: "What’s a kind way to reply to this?" },
      { type: "input", w: 12, typed: "Help me plan Tuesday." },
      { type: "kinetic", w: 12, serif: true, lines: ["The box isn’t", "a *test.*"] },
      { type: "end", w: 12 },
    ],
  },
];

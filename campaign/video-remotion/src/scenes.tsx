import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "./theme";
import { SERIF, SANS, MONO } from "./fonts";

export type Word = { word: string; start: number; end: number };

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const springIn = (frame: number, fps: number, delay = 0, damping = 13) =>
  spring({ frame: frame - delay, fps, config: { damping, mass: 0.7, stiffness: 120 } });
export const typed = (text: string, frame: number, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], clamp)));

/* accent markup: *word* -> terracotta (italic if serif) */
const richSegments = (line: string) => {
  const segs: { t: string; accent: boolean }[] = [];
  let accent = false;
  for (const part of line.split("*")) {
    if (part) segs.push({ t: part, accent });
    accent = !accent;
  }
  return segs;
};

/* mono prompt with [brackets] in terracotta */
const MonoPrompt: React.FC<{ text: string; caret?: boolean }> = ({ text, caret }) => {
  const nodes: React.ReactNode[] = [];
  let inBr = false;
  [...text].forEach((ch, i) => {
    if (ch === "[") inBr = true;
    nodes.push(
      <span key={i} style={{ color: inBr ? C.terra : C.creamOnDark }}>
        {ch}
      </span>
    );
    if (ch === "]") inBr = false;
  });
  return (
    <span style={{ fontFamily: MONO, fontSize: 42, lineHeight: 1.42, whiteSpace: "pre-wrap" }}>
      {nodes}
      {caret && <span style={{ color: C.terra }}>▍</span>}
    </span>
  );
};

/* ---------------- animated background ---------------- */
export const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = interpolate(frame % 600, [0, 300, 600], [30, 60, 30]);
  const gy = interpolate(frame % 720, [0, 360, 720], [16, 40, 16]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 45% at ${gx}% ${gy}%, rgba(201,122,87,0.20), rgba(32,26,23,0) 60%), radial-gradient(50% 40% at 85% 92%, rgba(147,164,143,0.07), rgba(32,26,23,0) 55%), ${C.espresso}`,
      }}
    />
  );
};

/* ---------------- word-by-word captions (real timestamps) ---------------- */
export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phrases = useMemo(() => {
    const N = 4;
    const out: { words: Word[]; start: number; end: number }[] = [];
    for (let i = 0; i < words.length; i += N) {
      const c = words.slice(i, i + N);
      if (c.length) out.push({ words: c, start: c[0].start, end: c[c.length - 1].end });
    }
    return out;
  }, [words]);
  const t = frame / fps;
  const active =
    phrases.find((p) => t >= p.start && t < p.end) ??
    (phrases.length && t >= phrases[phrases.length - 1].end ? phrases[phrases.length - 1] : phrases[0]);
  if (!active) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 380 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 20px", maxWidth: 900, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appeared = t >= w.start;
          const isActive = t >= w.start && t < w.end;
          const pop = appeared ? springIn(frame, fps, Math.round(w.start * fps), 12) : 0;
          return (
            <span
              key={i}
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 66,
                lineHeight: 1.15,
                letterSpacing: -1,
                color: isActive ? C.terra : C.creamOnDark,
                opacity: appeared ? 1 : 0.18,
                transform: `translateY(${(1 - pop) * 26}px) scale(${isActive ? 1.06 : 1})`,
                textShadow: "0 6px 30px rgba(0,0,0,0.5)",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ children: string; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springIn(frame, fps, delay);
  return (
    <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: C.terra, opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}>
      {children}
    </div>
  );
};

/* ---------------- scene: kinetic lines ---------------- */
export const Kinetic: React.FC<{ lines: string[]; serif?: boolean; size?: number }> = ({ lines, serif, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fs = size ?? (serif ? 124 : 116);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: serif ? 6 : 14 }}>
      {lines.map((line, i) => {
        const s = springIn(frame, fps, 4 + i * 16, 11);
        return (
          <div
            key={i}
            style={{
              width: "100%",
              textAlign: "center",
              padding: "0 60px",
              fontFamily: serif ? SERIF : SANS,
              fontWeight: serif ? 400 : 800,
              fontSize: fs,
              lineHeight: 1.04,
              letterSpacing: serif ? 0 : -3,
              color: C.creamOnDark,
              opacity: s,
              transform: `translateY(${(1 - s) * 55}px) scale(${0.92 + s * 0.08})`,
            }}
          >
            {richSegments(line).map((seg, j) => (
              <span key={j} style={{ color: seg.accent ? C.terra : "inherit", fontStyle: serif && seg.accent ? "italic" : "normal" }}>
                {seg.t}
              </span>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- scene: chat ---------------- */
const Bubble: React.FC<{ side: "user" | "ai"; enter: number; children: React.ReactNode }> = ({ side, enter, children }) => {
  const user = side === "user";
  return (
    <div
      style={{
        alignSelf: user ? "flex-end" : "flex-start",
        maxWidth: 780,
        background: user ? "rgba(201,122,87,0.16)" : C.card,
        border: `1px solid ${user ? "rgba(201,122,87,0.4)" : C.line}`,
        borderRadius: 34,
        borderBottomRightRadius: user ? 10 : 34,
        borderBottomLeftRadius: user ? 34 : 10,
        padding: "28px 36px",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 4px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.dim, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame - i * 6) / 4)) }} />
      ))}
    </div>
  );
};

export const Chat: React.FC<{ eyebrow: string; prompt: string; answer: string; tone: "flat" | "good" }> = ({ eyebrow, prompt, answer, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typeEnd = Math.min(80, prompt.length * 1.6 + 10);
  const shownPrompt = typed(prompt, frame, 8, typeEnd);
  const ansStart = typeEnd + 20;
  const ansEnd = ansStart + Math.min(170, answer.length * 1.4);
  const shownAnswer = typed(answer, frame, ansStart, ansEnd);
  return (
    <AbsoluteFill style={{ padding: "0 70px", justifyContent: "center", gap: 32 }}>
      <div style={{ marginBottom: 8 }}><Eyebrow>{eyebrow}</Eyebrow></div>
      <Bubble side="user" enter={springIn(frame, fps, 4)}>
        <MonoPrompt text={shownPrompt} caret={frame < typeEnd} />
      </Bubble>
      <Bubble side="ai" enter={springIn(frame, fps, ansStart - 14)}>
        {frame < ansStart ? (
          <Dots />
        ) : (
          <span style={{ fontFamily: SANS, fontWeight: tone === "good" ? 500 : 400, fontSize: 44, lineHeight: 1.5, whiteSpace: "pre-line", color: tone === "good" ? C.creamOnDark : C.dim }}>
            {shownAnswer}
          </span>
        )}
      </Bubble>
    </AbsoluteFill>
  );
};

/* ---------------- scene: chips (pill grid | numbered list) ---------------- */
export const Chips: React.FC<{ title: string; items: string[]; mode: "pill" | "numbered" }> = ({ title, items, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = springIn(frame, fps, 4);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: mode === "pill" ? 56 : 44, padding: "0 80px" }}>
      <div style={{ textAlign: "center", opacity: titleS, transform: `translateY(${(1 - titleS) * 30}px)`, fontFamily: SERIF, fontSize: 112, color: C.creamOnDark, lineHeight: 1.02 }}>
        {richSegments(title).map((s, j) => (
          <span key={j} style={{ color: s.accent ? C.terra : "inherit", fontStyle: s.accent ? "italic" : "normal" }}>{s.t}</span>
        ))}
      </div>
      {mode === "pill" ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, maxWidth: 900 }}>
          {items.map((p, i) => {
            const s = springIn(frame, fps, 16 + i * 8, 11);
            return (
              <div key={p} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.espresso, background: C.terra, borderRadius: 999, padding: "20px 42px", opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + s * 0.2})`, boxShadow: "0 18px 40px -18px rgba(201,122,87,0.8)" }}>
                {p}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%", maxWidth: 820 }}>
          {items.map((label, i) => {
            const s = springIn(frame, fps, 20 + i * 18, 12);
            return (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 28, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
                <span style={{ fontFamily: SERIF, fontSize: 84, color: C.terra, minWidth: 70 }}>{i + 1}</span>
                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 58, color: C.creamOnDark }}>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- scene: input box (blank box typing) ---------------- */
export const InputBox: React.FC<{ label?: string; typed: string }> = ({ label, typed: full }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = springIn(frame, fps, 4);
  const end = Math.min(70, full.length * 1.7);
  const shown = typed(full, frame, 10, end);
  const caret = Math.floor(frame / 15) % 2 === 0 || frame < end;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 34, padding: "0 70px" }}>
      {label && <Eyebrow>{label}</Eyebrow>}
      <div style={{ width: "100%", background: C.card, border: `1px solid ${C.line}`, borderRadius: 30, padding: "44px 46px", opacity: enter, transform: `translateY(${(1 - enter) * 30}px)` }}>
        <span style={{ fontFamily: MONO, fontSize: 46, color: C.creamOnDark }}>
          {shown}
          {caret && <span style={{ color: C.terra }}>▍</span>}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- scene: end card ---------------- */
export const EndCard: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springIn(frame, fps, 4);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24 }}>
      <div style={{ width: 70, height: 70, borderRadius: 40, background: C.terra, display: "flex", justifyContent: "center", alignItems: "center", opacity: s, transform: `scale(${s})` }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round"><path d="M12 3v18M3 12h18" /></svg>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 92, color: C.creamOnDark, opacity: s }}>
        AI, Made <span style={{ fontStyle: "italic", color: C.terra }}>Friendly</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.dim, textAlign: "center", maxWidth: 760, opacity: s }}>{cta}</div>
      <div style={{ fontFamily: MONO, fontSize: 34, color: C.terra, opacity: s, marginTop: 8 }}>→  guide.delightdigital.online</div>
    </AbsoluteFill>
  );
};

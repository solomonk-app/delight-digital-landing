import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Bg, Captions, Chat, Chips, EndCard, InputBox, Kinetic, Word } from "./scenes";
import type { Scene } from "./manifests";

export type DailyProps = {
  audio: string;
  wordsFile: string;
  cta: string;
  scenes: Scene[];
  words: Word[];
};

const renderScene = (s: Scene, cta: string): React.ReactNode => {
  switch (s.type) {
    case "kinetic":
      return <Kinetic lines={s.lines} serif={s.serif} size={s.size} />;
    case "chat":
      return <Chat eyebrow={s.eyebrow} prompt={s.prompt} answer={s.answer} tone={s.tone} />;
    case "chips":
      return <Chips title={s.title} items={s.items} mode={s.mode} />;
    case "input":
      return <InputBox label={s.label} typed={s.typed} />;
    case "end":
      return <EndCard cta={cta} />;
  }
};

export const DailyVideo: React.FC<DailyProps> = ({ audio, cta, scenes, words }) => {
  const { durationInFrames } = useVideoConfig();
  const totalW = scenes.reduce((a, s) => a + s.w, 0);
  let acc = 0;
  const segs = scenes.map((s) => {
    const from = Math.round((acc / totalW) * durationInFrames);
    acc += s.w;
    const to = Math.round((acc / totalW) * durationInFrames);
    return { s, from, dur: Math.max(1, to - from) };
  });
  return (
    <AbsoluteFill>
      <Audio src={staticFile(audio)} />
      <Bg />
      {segs.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.dur}>
          {renderScene(seg.s, cta)}
        </Sequence>
      ))}
      <Captions words={words} />
    </AbsoluteFill>
  );
};

import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { DailyVideo } from "./DailyVideo";
import { DAYS } from "./manifests";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {DAYS.map((day) => (
        <Composition
          key={day.id}
          id={day.id}
          component={DailyVideo}
          durationInFrames={900}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ audio: day.audio, wordsFile: day.wordsFile, cta: day.cta, scenes: day.scenes, words: [] }}
          calculateMetadata={async ({ props }) => {
            const dur = await getAudioDurationInSeconds(staticFile(props.audio));
            const words = await fetch(staticFile(props.wordsFile)).then((r) => r.json());
            return { durationInFrames: Math.round(dur * FPS), props: { ...props, words } };
          }}
        />
      ))}
    </>
  );
};

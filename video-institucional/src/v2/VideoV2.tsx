import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { K } from "./theme";
import { S, TOTAL_V2 } from "./timeline";
import { Header } from "./ui";
import { Hook } from "./scenes/Hook";
import { Passo1 } from "./scenes/Passo1";
import { Passo2 } from "./scenes/Passo2";
import { Passo3 } from "./scenes/Passo3";
import { DiaADia } from "./scenes/DiaADia";
import { Final } from "./scenes/Final";

const SCENES: { key: keyof typeof S; name: string; C: React.FC }[] = [
  { key: "hook", name: "1 · Abertura", C: Hook },
  { key: "passo1", name: "2 · Passo 1 — Conversa", C: Passo1 },
  { key: "passo2", name: "3 · Passo 2 — Equipamentos", C: Passo2 },
  { key: "passo3", name: "4 · Passo 3 — Assistência técnica", C: Passo3 },
  { key: "diaADia", name: "5 · No dia a dia", C: DiaADia },
  { key: "final", name: "6 · Encerramento", C: Final },
];

const PersistentHeader: React.FC = () => {
  const f = useCurrentFrame();
  const step = f >= S.passo3.from && f < S.diaADia.from ? 3 : f >= S.passo2.from && f < S.passo3.from ? 2 : f >= S.passo1.from && f < S.passo2.from ? 1 : null;
  const caption = f >= S.diaADia.from && f < S.final.from ? "No dia a dia" : null;
  const visible = interpolate(f, [0, 12, S.final.from - 10, S.final.from], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Header step={step} caption={caption} visible={visible} />;
};

export const VideoV2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: K.bg }}>
    {SCENES.map(({ key, name, C }) => (
      <Sequence key={key} name={name} from={S[key].from} durationInFrames={S[key].dur}>
        <C />
      </Sequence>
    ))}
    <PersistentHeader />
    <Audio src={staticFile("audio/trilha_v2.wav")} volume={(f) => 0.75 * interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" })} />
  </AbsoluteFill>
);

export const DURATION_V2 = TOTAL_V2;

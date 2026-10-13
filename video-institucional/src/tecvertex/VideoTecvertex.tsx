import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { K } from "../v2/theme";
import { Header, useLayout } from "../v2/ui";
import { TecvertexMini } from "./brand";
import { T, TOTAL_TV } from "./timeline";
import { Abertura } from "./scenes/Abertura";
import { Conversa } from "./scenes/Conversa";
import { Cliente } from "./scenes/Cliente";
import { Site } from "./scenes/Site";
import { Celular } from "./scenes/Celular";
import { Gestao } from "./scenes/Gestao";
import { Funil } from "./scenes/Funil";
import { Insights } from "./scenes/Insights";
import { Parceria } from "./scenes/Parceria";
import { Encerramento } from "./scenes/Encerramento";

const SCENES: { key: keyof typeof T; name: string; C: React.FC }[] = [
  { key: "hook", name: "1 · Abertura", C: Abertura },
  { key: "conversa", name: "2 · A conversa", C: Conversa },
  { key: "cliente", name: "3 · Bem-vinda, Odontocril", C: Cliente },
  { key: "site", name: "4 · O site no computador", C: Site },
  { key: "celular", name: "5 · O site no celular", C: Celular },
  { key: "gestao", name: "6 · Sistema de gestão — painel", C: Gestao },
  { key: "funil", name: "7 · Sistema — venda e baixa no estoque", C: Funil },
  { key: "insights", name: "8 · Sistema — alertas", C: Insights },
  { key: "parceria", name: "9 · Parceria", C: Parceria },
  { key: "final", name: "10 · Encerramento", C: Encerramento },
];

const CAPTIONS: [keyof typeof T, string][] = [
  ["conversa", "Como tudo começou"],
  ["cliente", "Cliente nº 1"],
  ["site", "O site"],
  ["celular", "O site no celular"],
  ["gestao", "O sistema"],
  ["funil", "O sistema"],
  ["insights", "O sistema"],
  ["parceria", "Parceria"],
];

const PersistentHeader: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useLayout();
  const cap = CAPTIONS.find(([k]) => f >= T[k].from && f < T[k].from + T[k].dur);
  const visible = interpolate(f, [0, 12, T.final.from - 10, T.final.from], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Header step={null} caption={cap ? cap[1] : null} visible={visible} brand={<TecvertexMini u={u} />} />;
};

export const VideoTecvertex: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: K.bg }}>
    {SCENES.map(({ key, name, C }) => (
      <Sequence key={key} name={name} from={T[key].from} durationInFrames={T[key].dur}>
        <C />
      </Sequence>
    ))}
    <PersistentHeader />
    <Audio src={staticFile("audio/trilha_tecvertex.wav")} volume={(f) => 0.75 * interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" })} />
  </AbsoluteFill>
);

export const DURATION_TV = TOTAL_TV;

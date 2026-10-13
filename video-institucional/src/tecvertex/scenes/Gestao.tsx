import React from "react";
import { useCurrentFrame } from "remotion";
import { K } from "../../v2/theme";
import { Headline, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { AppWindow, Cam, camAt, Highlight, Shots } from "../screen";
import { T } from "../timeline";

export const W = 920;
export const H = 1060;
export const VW = W;
export const VH = H - 60;

const CAM: Cam[] = [
  { f: 0, x: 520, y: 470, s: 0.95 },
  { f: 40, x: 520, y: 470, s: 0.95 },
  { f: 75, x: 900, y: 175, s: 1.25 },
  { f: 125, x: 1460, y: 175, s: 1.25 },
  { f: 175, x: 1090, y: 445, s: 0.92 },
  { f: 240, x: 1060, y: 450, s: 0.98 },
];

const KPIS = [
  { x: 370, at: 80 },
  { x: 733, at: 96 },
  { x: 1096, at: 118 },
  { x: 1459, at: 134 },
];

const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(CAM, frame);
  return (
    <AppWindow url="Tecvertex Gestão · Painel">
      <Shots cam={cam} vw={VW} vh={VH} layers={[{ src: "dash.jpg", from: 0, fade: 1 }]}>
        {KPIS.map((k, i) => (
          <Highlight key={k.x} x={k.x} y={116} w={346} h={118} at={k.at} until={KPIS[i + 1]?.at ?? 160} />
        ))}
      </Shots>
    </AppWindow>
  );
};

export const Gestao: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.gestao.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        noteText="Dados de demonstração"
        headline={<Headline start={0} size={(vertical ? 80 : 76) * u} lines={[{ text: "E por trás do site," }, { text: "um sistema de gestão.", color: K.blue }]} />}
        card={<Dashboard />}
      />
      <Sfx name="whoosh" at={4} volume={0.3} />
      {KPIS.map((k) => (
        <Sfx key={k.x} name="click" at={k.at} volume={0.2} />
      ))}
    </StepScene>
  );
};

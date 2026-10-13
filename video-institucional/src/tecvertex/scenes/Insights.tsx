import React from "react";
import { useCurrentFrame } from "remotion";
import { K } from "../../v2/theme";
import { Headline, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { AppWindow, Cam, camAt, Highlight, Shots, Tag } from "../screen";
import { T } from "../timeline";
import { H, VH, VW, W } from "./Gestao";

// Cartões de insights automáticos do painel (coordenadas da captura)
const CARDS = [
  { x: 391, label: "O que repor", at: 24, color: "#EAB308" },
  { x: 861, label: "Quem não compra há tempo", at: 74, color: "#F43F5E" },
  { x: 1331, label: "Previsão de vendas do mês", at: 124, color: K.green },
];
const Y = 717;

const CAM: Cam[] = [
  { f: 0, x: 900, y: 700, s: 0.95 },
  { f: 18, x: 620, y: 770, s: 1.2 },
  { f: 60, x: 620, y: 770, s: 1.2 },
  { f: 72, x: 1088, y: 770, s: 1.2 },
  { f: 110, x: 1088, y: 770, s: 1.2 },
  { f: 122, x: 1558, y: 770, s: 1.2 },
  { f: T.insights.dur, x: 1558, y: 770, s: 1.24 },
];

const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AppWindow url="Tecvertex Gestão · Painel">
      <Shots cam={camAt(CAM, frame)} vw={VW} vh={VH} layers={[{ src: "dash.jpg", from: 0, fade: 1 }]}>
        {CARDS.map((c, i) => (
          <React.Fragment key={c.x}>
            <Highlight x={c.x} y={Y} w={454} h={118} at={c.at} until={CARDS[i + 1]?.at ?? 100000} color={c.color} />
            <Tag x={c.x} y={Y + 136} at={c.at + 8} bg={c.color}>
              {c.label}
            </Tag>
          </React.Fragment>
        ))}
      </Shots>
    </AppWindow>
  );
};

export const Insights: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.insights.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        noteText="Dados de demonstração"
        headline={<Headline start={0} size={(vertical ? 80 : 76) * u} lines={[{ text: "E ainda avisa o que" }, { text: "precisa de atenção.", color: K.blue }]} />}
        card={<Panel />}
      />
      {CARDS.map((c) => (
        <Sfx key={c.x} name="click" at={c.at} volume={0.3} />
      ))}
    </StepScene>
  );
};

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Chair } from "../../components/Illustrations";
import { F_TEXT, K } from "../theme";
import { S } from "../timeline";
import { Card, Check, clamp, Headline, OUT, Sfx, StepLayout, StepScene, useLayout } from "../ui";

const W = 920;
const H = 900;
const LAMP = 30;
const PILLS = [
  { label: "Segurança", at: 60 },
  { label: "Eficiência", at: 75 },
  { label: "Pronto para atender", at: 90 },
];

const Room: React.FC = () => {
  const frame = useCurrentFrame();
  const lamp = interpolate(frame, [LAMP, LAMP + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  return (
    <Card>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 45% at 40% 40%, rgba(255,243,209,${lamp * 0.9}) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 30, height: 600, scale: String(interpolate(frame, [0, S.diaADia.dur], [1, 1.06])) }}>
        <Chair start={4} dur={30} lamp={lamp} width={3.6} />
      </div>
      <div style={{ position: "absolute", left: 32, right: 32, bottom: 40, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {PILLS.map(({ label, at }) => {
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: OUT });
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, background: K.bg, borderRadius: 999, padding: "14px 22px 14px 14px", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>
              <Check size={34} p={p} />
              <span style={{ fontFamily: F_TEXT, fontWeight: 600, fontSize: 28, color: K.ink }}>{label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const DiaADia: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={S.diaADia.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        headline={<Headline start={0} size={(vertical ? 78 : 76) * u} lines={[{ text: "Tudo pronto para" }, { text: "atender seus pacientes." }]} />}
        card={<Room />}
      />
      {PILLS.map((p) => (
        <Sfx key={p.label} name="click" at={p.at} volume={0.3} />
      ))}
    </StepScene>
  );
};

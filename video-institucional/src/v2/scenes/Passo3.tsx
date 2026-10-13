import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chair, CuringLight, Tools, Ultrasound, VacuumPump } from "../../components/Illustrations";
import { F_DISPLAY, F_TEXT, K } from "../theme";
import { S } from "../timeline";
import { Card, Check, clamp, Headline, OUT, Sfx, StepLayout, StepScene, useLayout } from "../ui";

const W = 920;
const H = 900;

const ROWS = [
  { name: "Cadeira odontológica", Art: Chair },
  { name: "Ultrassom", Art: Ultrasound },
  { name: "Bomba de vácuo", Art: VacuumPump },
  { name: "Fotopolimerizador", Art: CuringLight },
];
const CHECK_AT = (i: number) => 45 + i * 15;
const DONE_AT = (i: number) => 90 + i * 15;

const Status: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const checking = frame >= CHECK_AT(i) && frame < DONE_AT(i);
  const done = frame >= DONE_AT(i);
  const p = interpolate(frame, [DONE_AT(i), DONE_AT(i) + 12], [0, 1], { ...clamp, easing: OUT });
  const [bg, fg, label] = done ? [K.greenSoft, K.green, "Em funcionamento"] : checking ? [K.amberSoft, K.amber, "Em verificação"] : [K.bg, K.muted, "Aguardando"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: bg, color: fg, fontFamily: F_TEXT, fontWeight: 600, fontSize: 22, padding: "10px 16px", borderRadius: 999 }}>
      {done ? (
        <Check size={26} p={p} bg={K.green} />
      ) : checking ? (
        <div style={{ width: 22, height: 22, borderRadius: 11, border: `3px solid ${K.amber}55`, borderTopColor: K.amber, rotate: `${frame * 18}deg` }} />
      ) : (
        <div style={{ width: 12, height: 12, borderRadius: 6, background: K.faint }} />
      )}
      {label}
    </div>
  );
};

const Service: React.FC = () => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "32px 32px 26px", borderBottom: `1px solid ${K.line}` }}>
      <div style={{ width: 96, height: 96, borderRadius: 24, background: K.blueSoft, padding: 4 }}>
        <Tools start={8} dur={30} width={9} />
      </div>
      <div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 38, color: K.ink, letterSpacing: -1 }}>Assistência técnica</div>
        <div style={{ fontFamily: F_TEXT, fontSize: 24, color: K.muted }}>Equipamentos do consultório</div>
      </div>
    </div>
    {ROWS.map(({ name, Art }, i) => (
      <div key={name} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 32px", height: 150, borderBottom: i < ROWS.length - 1 ? `1px solid ${K.line}` : undefined }}>
        <div style={{ width: 130, height: 98, borderRadius: 16, background: K.bg, padding: 8 }}>
          <Art start={14 + i * 5} dur={26} width={8} />
        </div>
        <div style={{ flex: 1, fontFamily: F_TEXT, fontWeight: 600, fontSize: 30, color: K.ink }}>{name}</div>
        <Status i={i} />
      </div>
    ))}
    <div style={{ position: "absolute", left: 32, right: 32, bottom: 30, fontFamily: F_TEXT, fontSize: 24, color: K.muted }}>
      Cuidado com soluções essenciais para o seu consultório.
    </div>
  </Card>
);

export const Passo3: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={S.passo3.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        headline={<Headline start={0} size={(vertical ? 78 : 76) * u} lines={[{ text: "E conte com" }, { text: "assistência técnica.", color: K.blue }]} />}
        card={<Service />}
      />
      {ROWS.map((r, i) => (
        <Sfx key={r.name} name="success" at={DONE_AT(i)} volume={0.22} />
      ))}
    </StepScene>
  );
};

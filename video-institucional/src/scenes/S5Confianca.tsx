import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CameraPush, Eyebrow, IllustrativeNote, LightBackdrop, RiseText, useUnit } from "../components/Brand";
import { Chair } from "../components/Illustrations";
import { Visual } from "../components/Visual";
import { C, FONT_TITLE } from "../theme";
import { local, seqDur, voStart, wordAt } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

const Value: React.FC<{ label: string; at: number; size: number }> = ({ label, at, size }) => {
  const f = useCurrentFrame() - at;
  const p = interpolate(f, [0, 20], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, opacity: p, translate: `0px ${(1 - p) * size * 0.5}px` }}>
      <svg viewBox="0 0 24 24" style={{ width: size * 0.8, height: size * 0.8, flexShrink: 0 }}>
        <circle cx={12} cy={12} r={11} fill={C.blue} />
        <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(f, [6, 18], [0, 1], clamp)} />
      </svg>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: size, color: C.ink, letterSpacing: -size * 0.015 }}>{label}</div>
    </div>
  );
};

export const S5Confianca: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const dur = seqDur("confianca");
  const vo = local("confianca", voStart("n4"));
  // o refletor acende: equipamento em funcionamento
  const lamp = interpolate(frame, [36, 60], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const size = (vertical ? 64 : 56) * u;

  return (
    <AbsoluteFill>
      <LightBackdrop drift={1.5} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at ${vertical ? "50% 30%" : "30% 45%"}, #FFF6DD ${0}%, transparent 70%)`, opacity: lamp * 0.8 }} />
      <AbsoluteFill style={{ flexDirection: vertical ? "column" : "row", alignItems: "center", justifyContent: "center", gap: (vertical ? 40 : 60) * u, padding: (vertical ? 80 : 100) * u }}>
        <div style={{ position: "relative", width: (vertical ? 1000 : 1000) * u, height: (vertical ? 750 : 750) * u, overflow: "hidden", borderRadius: 30 * u }}>
          <CameraPush from={1.0} to={1.12} dur={dur} origin="40% 45%">
            <Visual media="equipe" start={0} dur={dur} fallback={<Chair start={2} dur={34} lamp={lamp} width={3.5} />} />
          </CameraPush>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * u, alignItems: "flex-start", width: (vertical ? 900 : 760) * u }}>
          <Eyebrow text="Confiança" start={14} size={28 * u} align="left" />
          <RiseText text="Bons equipamentos, uma rotina mais preparada." start={vo + 6} size={(vertical ? 76 : 68) * u} align="left" />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 * u, marginTop: 14 * u }}>
            <Value label="Segurança" at={vo + wordAt("n4", "segura") - 4} size={size} />
            <Value label="Eficiência" at={vo + wordAt("n4", "eficiente") - 4} size={size} />
            <Value label="Atenção aos seus pacientes" at={vo + wordAt("n4", "preparada") - 4} size={size} />
          </div>
        </div>
      </AbsoluteFill>
      <IllustrativeNote />
    </AbsoluteFill>
  );
};

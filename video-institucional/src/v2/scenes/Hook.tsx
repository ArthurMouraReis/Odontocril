import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F_DISPLAY, F_TEXT, K } from "../theme";
import { clamp, OUT, Sfx, StepScene, useLayout } from "../ui";
import { S } from "../timeline";

const SWAPS = ["do sorriso.", "dos pacientes.", "da clínica."];
const SWAP_EVERY = 30;
const SECOND = 96;

const Swap: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: size * 1.12, overflow: "hidden" }}>
      {SWAPS.map((w, i) => {
        const a = i * SWAP_EVERY;
        const b = a + SWAP_EVERY;
        const last = i === SWAPS.length - 1;
        const pin = interpolate(frame, [a, a + 12], [1, 0], { ...clamp, easing: OUT });
        const pout = last ? 0 : interpolate(frame, [b, b + 12], [0, 1], { ...clamp, easing: OUT });
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              fontFamily: F_DISPLAY,
              fontWeight: 600,
              fontSize: size,
              lineHeight: 1.06,
              letterSpacing: -size * 0.035,
              color: K.blue,
              whiteSpace: "nowrap",
              translate: `0px ${(pin - pout) * size * 1.1}px`,
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const size = (vertical ? 106 : 120) * u;
  const rise = (d: number) => interpolate(frame - d, [0, 20], [0, 1], { ...clamp, easing: OUT });
  const line = (text: string, d: number, color = K.ink) => (
    <div style={{ overflow: "hidden", paddingBottom: size * 0.1, marginBottom: -size * 0.1 }}>
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: -size * 0.035, color, whiteSpace: "nowrap", translate: `0px ${(1 - rise(d)) * size * 1.1}px` }}>{text}</div>
    </div>
  );
  return (
    <StepScene dur={S.hook.dur}>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: (vertical ? 80 : 140) * u, paddingTop: 40 * u }}>
        {line("Você cuida", 0)}
        <Swap size={size} />
        <div style={{ height: 40 * u }} />
        {line("A gente cuida", SECOND)}
        {line("dos equipamentos.", SECOND + 5)}
        <div
          style={{
            marginTop: 50 * u,
            fontFamily: F_TEXT,
            fontSize: 38 * u,
            color: K.muted,
            opacity: interpolate(frame, [SECOND + 24, SECOND + 40], [0, 1], clamp),
          }}
        >
          Equipamentos odontológicos e assistência técnica.
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh" at={SWAP_EVERY} volume={0.25} />
      <Sfx name="whoosh" at={SWAP_EVERY * 2} volume={0.25} />
      <Sfx name="click" at={SECOND} volume={0.3} />
    </StepScene>
  );
};

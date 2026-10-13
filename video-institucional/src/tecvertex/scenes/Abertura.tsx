import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F_DISPLAY, F_TEXT, K } from "../../v2/theme";
import { clamp, OUT, Sfx, StepScene, useLayout } from "../../v2/ui";
import { T } from "../timeline";

const SWAPS = ["um primeiro passo.", "uma conversa.", "a primeira cliente."];
const SWAP_AT = [14, 44, 74];

export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const size = (vertical ? 104 : 116) * u;
  const text: React.CSSProperties = { fontFamily: F_DISPLAY, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: -size * 0.035, whiteSpace: "nowrap" };
  const rise = (d: number) => interpolate(frame - d, [0, 20], [0, 1], { ...clamp, easing: OUT });
  return (
    <StepScene dur={T.hook.dur}>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: (vertical ? 80 : 140) * u, paddingTop: 40 * u }}>
        {["Toda história", "começa com"].map((l, i) => (
          <div key={l} style={{ overflow: "hidden", paddingBottom: size * 0.1, marginBottom: -size * 0.1 }}>
            <div style={{ ...text, color: K.ink, translate: `0px ${(1 - rise(i * 5)) * size * 1.1}px` }}>{l}</div>
          </div>
        ))}
        <div style={{ position: "relative", height: size * 1.16, overflow: "hidden" }}>
          {SWAPS.map((w, i) => {
            const pin = interpolate(frame, [SWAP_AT[i], SWAP_AT[i] + 12], [1, 0], { ...clamp, easing: OUT });
            const next = SWAP_AT[i + 1];
            const pout = next === undefined ? 0 : interpolate(frame, [next, next + 12], [0, 1], { ...clamp, easing: OUT });
            return (
              <div key={w} style={{ ...text, position: "absolute", left: 0, top: 0, color: K.blue, translate: `0px ${(pin - pout) * size * 1.1}px` }}>
                {w}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 56 * u, fontFamily: F_TEXT, fontSize: 40 * u, color: K.muted, opacity: interpolate(frame, [112, 128], [0, 1], clamp) }}>
          E a nossa tem nome.
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh" at={SWAP_AT[1]} volume={0.25} />
      <Sfx name="whoosh" at={SWAP_AT[2]} volume={0.25} />
    </StepScene>
  );
};

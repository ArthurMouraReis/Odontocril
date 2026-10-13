import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F_DISPLAY, F_TEXT, K } from "../../v2/theme";
import { clamp, OUT, Sfx, StepScene, useLayout } from "../../v2/ui";
import { T } from "../timeline";

export const Parceria: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const p = (d: number) => interpolate(frame - d, [0, 18], [0, 1], { ...clamp, easing: OUT });
  const size = (vertical ? 84 : 80) * u;
  return (
    <StepScene dur={T.parceria.dur}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 80 * u }}>
        {/* Tecvertex × Odontocril */}
        <div style={{ display: "flex", alignItems: "center", gap: 46 * u }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * u, opacity: p(4), translate: `${(1 - p(4)) * -60 * u}px 0px` }}>
            <Img src={staticFile("tecvertex/symbol.png")} style={{ height: 120 * u }} />
            <Img src={staticFile("tecvertex/wordmark.png")} style={{ height: 30 * u }} />
          </div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 500, fontSize: 64 * u, color: K.faint, opacity: p(14) }}>×</div>
          <div style={{ opacity: p(8), translate: `${(1 - p(8)) * 60 * u}px 0px` }}>
            <Img src={staticFile("brand/logo_mark.png")} style={{ height: 150 * u }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {[
            { t: "Obrigado pela confiança,", c: K.ink, d: 30 },
            { t: "Odontocril.", c: K.blue, d: 35 },
          ].map(({ t, c, d }) => (
            <div key={t} style={{ overflow: "hidden", paddingBottom: size * 0.1, marginBottom: -size * 0.1 }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: -size * 0.035, color: c, textAlign: "center", translate: `0px ${(1 - p(d)) * size * 1.1}px` }}>{t}</div>
            </div>
          ))}
          <div style={{ marginTop: 40 * u, fontFamily: F_TEXT, fontSize: 38 * u, color: K.muted, opacity: p(70), textAlign: "center" }}>
            Que seja o começo de muitas conquistas.
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="whoosh" at={4} volume={0.3} />
    </StepScene>
  );
};

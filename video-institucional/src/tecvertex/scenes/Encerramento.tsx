import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F_DISPLAY, F_TEXT, K } from "../../v2/theme";
import { ChatIcon, clamp, Cursor, OUT, Sfx, StepScene, useLayout } from "../../v2/ui";
import { TecvertexLogo } from "../brand";
import { T } from "../timeline";

// Dados do comercial oficial da Tecvertex
export const TECVERTEX = {
  cta: "Peça seu orçamento no WhatsApp",
  site: "solucoesinteligentestecvertex.base44.app",
};

const CLICK = 110;

export const Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const fade = (d: number) => {
    const p = interpolate(frame - d, [0, 16], [0, 1], { ...clamp, easing: OUT });
    return { opacity: p, translate: `0px ${(1 - p) * 24 * u}px` };
  };
  const press = interpolate(frame, [CLICK - 3, CLICK, CLICK + 6], [1, 0.95, 1], clamp);
  const ctaH = 92 * u;
  return (
    <StepScene dur={T.final.dur} exit={false}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 60 * u }}>
        <TecvertexLogo start={0} width={(vertical ? 620 : 560) * u} />
        <div style={{ ...fade(36), fontFamily: F_DISPLAY, fontWeight: 500, fontSize: (vertical ? 56 : 50) * u, lineHeight: 1.12, letterSpacing: -1.5 * u, color: K.ink, textAlign: "center" }}>
          Seu negócio pode ser
          <br />o próximo.
        </div>
        <div style={{ ...fade(56), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 * u }}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 * u, height: ctaH, padding: `0 ${40 * u}px`, borderRadius: ctaH / 2, background: K.ink, color: "#FFF", fontFamily: F_TEXT, fontWeight: 600, fontSize: 32 * u, scale: String(press) }}>
              <ChatIcon size={36 * u} color="#3DDC84" /> {TECVERTEX.cta}
            </div>
            <div style={{ position: "absolute", inset: 0, scale: String(u), transformOrigin: "0 0" }}>
              <Cursor
                appear={70}
                hide={CLICK + 50}
                keys={[
                  { f: 70, x: 640, y: 220 },
                  { f: CLICK - 12, x: 420, y: 52 },
                  { f: CLICK, x: 420, y: 52, click: true },
                  { f: CLICK + 40, x: 520, y: 150 },
                ]}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * u, fontFamily: F_TEXT, fontSize: 28 * u, color: K.muted }}>
            <svg viewBox="0 0 24 24" style={{ width: 28 * u, height: 28 * u }}>
              <circle cx={12} cy={12} r={9} fill="none" stroke={K.muted} strokeWidth={1.8} />
              <path d="M3 12 H21 M12 3 C 8 7, 8 17, 12 21 M12 3 C 16 7, 16 17, 12 21" fill="none" stroke={K.muted} strokeWidth={1.8} />
            </svg>
            {TECVERTEX.site}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="click" at={CLICK} volume={0.55} />
    </StepScene>
  );
};

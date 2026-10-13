import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Logo } from "../../components/Brand";
import { F_DISPLAY, F_TEXT, K } from "../theme";
import { ChatIcon, clamp, Cursor, OUT, Sfx, StepScene, useLayout } from "../ui";
import { S } from "../timeline";

export const CONTATOS = {
  instagram: "@odontocril_venda",
  site: "odontocril.com.br",
  telefone: "(48) 99162-7570",
};

const CTA_CLICK = 120;

export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const fade = (d: number) => {
    const p = interpolate(frame - d, [0, 16], [0, 1], { ...clamp, easing: OUT });
    return { opacity: p, translate: `0px ${(1 - p) * 24 * u}px` };
  };
  const press = interpolate(frame, [CTA_CLICK - 3, CTA_CLICK, CTA_CLICK + 6], [1, 0.95, 1], clamp);
  const ctaH = 96 * u;
  return (
    <StepScene dur={S.final.dur} exit={false}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 44 * u }}>
        <Logo start={2} width={(vertical ? 780 : 640) * u} showTagline />
        <div style={{ ...fade(30), fontFamily: F_DISPLAY, fontWeight: 600, fontSize: (vertical ? 58 : 52) * u, lineHeight: 1.1, letterSpacing: -1.5 * u, color: K.ink, textAlign: "center" }}>
          Equipamentos odontológicos
          <br />e assistência técnica.
        </div>
        <div style={{ ...fade(55), position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16 * u,
              height: ctaH,
              padding: `0 ${40 * u}px`,
              borderRadius: ctaH / 2,
              background: K.ink,
              color: "#FFF",
              fontFamily: F_TEXT,
              fontWeight: 600,
              fontSize: 32 * u,
              scale: String(press),
            }}
          >
            <ChatIcon size={38 * u} color="#3DDC84" /> Fale com a gente no WhatsApp
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", scale: String(u), transformOrigin: "0 0" }}>
            <Cursor
              appear={80}
              keys={[
                { f: 80, x: 560, y: 260 },
                { f: CTA_CLICK - 12, x: 380, y: 60 },
                { f: CTA_CLICK, x: 380, y: 60, click: true },
                { f: CTA_CLICK + 40, x: 470, y: 150 },
              ]}
              hide={CTA_CLICK + 60}
            />
          </div>
        </div>
        <div style={{ ...fade(75), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * u, fontFamily: F_TEXT, fontSize: 30 * u, color: K.muted }}>
          <div>
            <span style={{ color: K.ink, fontWeight: 600 }}>{CONTATOS.telefone}</span>
          </div>
          <div>
            {CONTATOS.instagram} <span style={{ color: K.faint }}>·</span> {CONTATOS.site}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="click" at={CTA_CLICK} volume={0.55} />
    </StepScene>
  );
};

import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CONTATOS } from "../../v2/scenes/Final";
import { F_DISPLAY, F_TEXT, K } from "../../v2/theme";
import { Card, clamp, Headline, OUT, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { T } from "../timeline";

const W = 920;
const H = 900;

const AREAS = ["Consultórios e cadeiras", "Ultrassom", "Bombas de vácuo", "Fotopolimerizadores", "Assistência técnica"];
const CHIP_AT = (i: number) => 70 + i * 8;
const CONTACT_AT = 120;

const Profile: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [14, 34], [0, 1], { ...clamp, easing: OUT });
  const badge = interpolate(frame, [36, 48], [0, 1], { ...clamp, easing: OUT });
  return (
    <Card>
      {/* selo */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 32,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: K.blueSoft,
          color: K.blue,
          fontFamily: F_TEXT,
          fontWeight: 600,
          fontSize: 24,
          padding: "10px 18px",
          borderRadius: 999,
          opacity: badge,
          scale: String(0.8 + 0.2 * badge),
          transformOrigin: "0 50%",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5, background: K.blue }} /> Cliente nº 1
      </div>
      <div style={{ position: "absolute", top: 30, right: 32, fontFamily: F_TEXT, fontSize: 22, color: K.faint, opacity: badge }}>Tecvertex</div>

      {/* logo oficial */}
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, scale: String(0.94 + 0.06 * logo) }}>
        <Img src={staticFile("brand/logo_hd.png")} style={{ width: 640 }} />
      </div>

      <div style={{ position: "absolute", top: 440, left: 32, right: 32, borderTop: `1px solid ${K.line}`, paddingTop: 30 }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 38, letterSpacing: -1, color: K.ink, opacity: interpolate(frame, [48, 62], [0, 1], clamp) }}>
          Equipamentos odontológicos e assistência técnica.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
          {AREAS.map((a, i) => {
            const p = interpolate(frame, [CHIP_AT(i), CHIP_AT(i) + 12], [0, 1], { ...clamp, easing: OUT });
            return (
              <div key={a} style={{ fontFamily: F_TEXT, fontWeight: 500, fontSize: 26, color: K.ink, background: K.bg, border: `1px solid ${K.line}`, borderRadius: 999, padding: "12px 22px", opacity: p, translate: `0px ${(1 - p) * 16}px` }}>
                {a}
              </div>
            );
          })}
        </div>
      </div>

      {/* contatos */}
      <div style={{ position: "absolute", left: 32, right: 32, bottom: 30, borderTop: `1px solid ${K.line}`, paddingTop: 24, display: "flex", flexDirection: "column", gap: 10, fontFamily: F_TEXT, fontSize: 26, color: K.muted, opacity: interpolate(frame, [CONTACT_AT, CONTACT_AT + 14], [0, 1], clamp) }}>
        <div>
          <span style={{ color: K.ink, fontWeight: 600 }}>{CONTATOS.instagram}</span> · {CONTATOS.site}
        </div>
        <div>Telefone / WhatsApp: {CONTATOS.telefone}</div>
      </div>
    </Card>
  );
};

export const Cliente: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.cliente.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        headline={<Headline start={0} size={(vertical ? 92 : 88) * u} lines={[{ text: "Bem-vinda," }, { text: "Odontocril.", color: K.blue }]} />}
        card={<Profile />}
      />
      <Sfx name="success" at={36} volume={0.4} />
      {AREAS.map((a, i) => (
        <Sfx key={a} name="click" at={CHIP_AT(i)} volume={0.18} />
      ))}
    </StepScene>
  );
};

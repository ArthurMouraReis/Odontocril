import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { F_TEXT, K } from "../../v2/theme";
import { Check, clamp, Headline, OUT, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { T } from "../timeline";

const W = 920;
const H = 1000;
const PHONE_W = 470;
const PHONE_H = ((PHONE_W - 28) * 16) / 9 + 28; // tela 9:16, igual ao vídeo

const FACTS = [
  { text: "Vertical 9:16", at: 60 },
  { text: "Horizontal 16:9", at: 75 },
  { text: "Trilha original", at: 90 },
];

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [8, 30], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: (W - PHONE_W) / 2,
          top: (H - PHONE_H) / 2,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 64,
          background: "#0E0F11",
          padding: 14,
          boxShadow: "0 50px 90px -30px rgba(17,19,21,0.35)",
          translate: `0px ${(1 - enter) * 60}px`,
          rotate: `${(1 - enter) * -3}deg`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 52, overflow: "hidden", background: K.bg }}>
          {/* prévia do vídeo institucional entregue (sem áudio) */}
          <Video src={staticFile("clips/odontocril-v2-preview.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", top: 12, left: "50%", translate: "-50% 0px", width: 120, height: 34, borderRadius: 17, background: "#0E0F11" }} />
        </div>
      </div>
      {/* etiquetas */}
      <div style={{ position: "absolute", left: (W + PHONE_W) / 2 - 40, top: 200, display: "flex", flexDirection: "column", gap: 16 }}>
        {FACTS.map(({ text, at }) => {
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: OUT });
          return (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1px solid ${K.line}`, borderRadius: 999, padding: "10px 18px 10px 10px", boxShadow: "0 12px 30px -12px rgba(17,19,21,0.25)", opacity: p, translate: `${(1 - p) * 30}px 0px`, fontFamily: F_TEXT, fontWeight: 600, fontSize: 24, color: K.ink, whiteSpace: "nowrap" }}>
              <Check size={30} p={p} /> {text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Entrega: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.entrega.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        headline={<Headline start={0} size={(vertical ? 80 : 76) * u} lines={[{ text: "Primeira entrega:" }, { text: "vídeo institucional.", color: K.blue }]} />}
        card={<Phone />}
      />
      {FACTS.map((f) => (
        <Sfx key={f.text} name="click" at={f.at} volume={0.3} />
      ))}
    </StepScene>
  );
};

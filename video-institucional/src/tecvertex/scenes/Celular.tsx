import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F_TEXT, K } from "../../v2/theme";
import { Check, ChatIcon, clamp, Headline, INOUT, OUT, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { MobileWaButton, SITE_MOBILE_W, SiteMobile } from "../site";
import { T } from "../timeline";

const W = 920;
const H = 1060;
const PHONE_W = 470;
const SCREEN_W = PHONE_W - 28;
const SCREEN_H = (SCREEN_W * 19.5) / 9;
const PHONE_H = SCREEN_H + 28;
const SCALE = SCREEN_W / SITE_MOBILE_W;
const SCROLL = { from: 30, to: 120, px: 480 };
const TAP = 150;
const SEND = 205;
const MSG = "Olá! Vim pelo site e gostaria de um orçamento.";

const CHIPS = [
  { text: "Layout responsivo", at: 40 },
  { text: "Botão de WhatsApp", at: 60 },
  { text: "Mensagem pronta", at: 175 },
];

const WhatsAppScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = frame >= SEND;
  const p = interpolate(frame, [SEND, SEND + 10], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ position: "absolute", inset: 0, background: K.chatBg, fontFamily: F_TEXT }}>
      <div style={{ paddingTop: 70, height: 140, boxSizing: "border-box", background: "#FFF", display: "flex", alignItems: "center", gap: 12, padding: "70px 20px 0", borderBottom: `1px solid ${K.line}` }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, border: `1px solid ${K.line}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Img src={staticFile("brand/logo_face.png")} style={{ width: 40 }} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 22, color: K.ink }}>Odontocril</div>
          <div style={{ fontSize: 15, color: K.muted }}>WhatsApp</div>
        </div>
      </div>
      {sent ? (
        <div style={{ position: "absolute", right: 16, top: 170, maxWidth: 330, background: K.bubbleOut, borderRadius: 16, padding: "12px 16px 8px", fontSize: 20, lineHeight: 1.35, color: K.ink, opacity: p, translate: `0px ${(1 - p) * 16}px` }}>
          {MSG}
          <span style={{ fontSize: 13, color: K.muted, marginLeft: 8 }}>
            10:02 <span style={{ color: "#4FA3E0" }}>✓✓</span>
          </span>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 30, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1, background: "#FFF", borderRadius: 22, padding: "12px 16px", fontSize: 18, lineHeight: 1.35, color: sent ? K.faint : K.ink }}>{sent ? "Mensagem" : MSG}</div>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: K.green, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0, scale: String(interpolate(frame, [SEND - 3, SEND, SEND + 6], [1, 0.85, 1], clamp)) }}>
          <svg viewBox="0 0 24 24" style={{ width: 22, height: 22 }}>
            <path d="M4 12 L20 4 L14 20 L11.5 13 Z" fill="#FFF" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Touch: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame() - at;
  if (f < -8 || f > 16) return null;
  const o = interpolate(f, [-8, 0, 6, 16], [0, 0.55, 0.4, 0], clamp);
  return <div style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: "#11131555", opacity: o, scale: String(interpolate(f, [-8, 0, 16], [0.7, 1, 1.3], clamp)) }} />;
};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 26], [0, 1], { ...clamp, easing: OUT });
  const scroll = interpolate(frame, [SCROLL.from, SCROLL.to], [0, SCROLL.px], { ...clamp, easing: INOUT });
  const chat = interpolate(frame, [TAP + 4, TAP + 20], [0, 1], { ...clamp, easing: OUT });
  const btnPress = interpolate(frame, [TAP - 3, TAP, TAP + 6], [1, 0.94, 1], clamp);
  const btnIn = interpolate(frame, [36, 50], [0, 1], { ...clamp, easing: OUT });
  const left = (W - PHONE_W) / 2 - 120;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left, top: (H - PHONE_H) / 2, width: PHONE_W, height: PHONE_H, borderRadius: 66, background: "#0E0F11", padding: 14, boxSizing: "border-box", boxShadow: "0 50px 90px -30px rgba(17,19,21,0.35)", translate: `0px ${(1 - enter) * 60}px` }}>
        <div style={{ position: "relative", width: SCREEN_W, height: SCREEN_H, borderRadius: 54, overflow: "hidden", background: "#FFF" }}>
          <div style={{ position: "absolute", left: 0, top: -scroll, width: SITE_MOBILE_W, scale: String(SCALE), transformOrigin: "0 0" }}>
            <SiteMobile start={6} />
          </div>
          {/* barra de status */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 34px 0", fontFamily: F_TEXT, fontWeight: 600, fontSize: 18, color: K.ink }}>
            <span>10:02</span>
            <span style={{ width: 26, height: 12, borderRadius: 3, border: `2px solid ${K.ink}` }} />
          </div>
          {/* botão fixo de WhatsApp */}
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 30, opacity: btnIn, translate: `0px ${(1 - btnIn) * 30}px` }}>
            <MobileWaButton press={btnPress} />
          </div>
          <Touch at={TAP} x={SCREEN_W / 2} y={SCREEN_H - 62} />
          {/* abre o WhatsApp com a mensagem pronta */}
          <div style={{ position: "absolute", inset: 0, translate: `${(1 - chat) * 100}% 0px` }}>{frame >= TAP ? <WhatsAppScreen /> : null}</div>
          <Touch at={SEND} x={SCREEN_W - 36} y={SCREEN_H - 54} />
          <div style={{ position: "absolute", top: 12, left: "50%", translate: "-50% 0px", width: 124, height: 36, borderRadius: 18, background: "#0E0F11" }} />
        </div>
      </div>
      {/* etiquetas */}
      <div style={{ position: "absolute", left: left + PHONE_W + 30, top: 260, display: "flex", flexDirection: "column", gap: 16 }}>
        {CHIPS.map(({ text, at }) => {
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: OUT });
          return (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1px solid ${K.line}`, borderRadius: 999, padding: "10px 18px 10px 10px", boxShadow: "0 12px 30px -12px rgba(17,19,21,0.25)", opacity: p, translate: `${(1 - p) * 30}px 0px`, fontFamily: F_TEXT, fontWeight: 600, fontSize: 24, color: K.ink, whiteSpace: "nowrap" }}>
              {text === "Botão de WhatsApp" ? <ChatIcon size={30} /> : <Check size={30} p={p} />} {text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Celular: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const size = (vertical ? 80 : 76) * u;
  const swap = interpolate(frame, [TAP - 8, TAP], [1, 0], clamp);
  return (
    <StepScene dur={T.celular.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        headline={
          <div style={{ position: "relative" }}>
            <div style={{ opacity: swap }}>
              <Headline start={0} size={size} lines={[{ text: "Bonito no computador." }, { text: "Melhor ainda no celular.", color: K.blue }]} />
            </div>
            {frame >= TAP ? (
              <div style={{ position: "absolute", inset: 0 }}>
                <Headline start={TAP} size={size} lines={[{ text: "E o contato chega" }, { text: "direto no WhatsApp.", color: K.green }]} />
              </div>
            ) : null}
          </div>
        }
        card={<Phone />}
      />
      <Sfx name="click" at={TAP} volume={0.5} />
      <Sfx name="whoosh" at={TAP + 4} volume={0.25} />
      <Sfx name="click" at={SEND} volume={0.5} />
      <Sfx name="message" at={SEND + 2} volume={0.5} />
    </StepScene>
  );
};

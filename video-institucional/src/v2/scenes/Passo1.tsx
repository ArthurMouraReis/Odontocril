import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F_TEXT, K } from "../theme";
import { S } from "../timeline";
import { Card, Caret, ChatIcon, clamp, Cursor, Headline, OUT, Sfx, StepLayout, StepScene, typed, useLayout } from "../ui";

const W = 920;
const H = 860;

// Roteiro da conversa (frames locais da cena)
const IN1 = 20;
const T1 = { text: "Estou montando meu consultório.", start: 40, send: 90 };
const T2 = { text: "Preciso de cadeira, ultrassom e fotopolimerizador.", start: 105, send: 165 };
const DOTS = 178;
const IN2 = 196;

const SEND = { x: 846, y: H - 56 };

const Bubble: React.FC<{ at: number; out?: boolean; text: string; time: string }> = ({ at, out, text, time }) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  const p = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", opacity: p, translate: `0px ${(1 - p) * 20}px`, scale: String(0.96 + p * 0.04), transformOrigin: out ? "100% 100%" : "0 100%" }}>
      <div
        style={{
          maxWidth: 640,
          background: out ? K.bubbleOut : "#FFFFFF",
          borderRadius: 18,
          padding: "16px 22px 12px",
          fontFamily: F_TEXT,
          fontSize: 30,
          lineHeight: 1.35,
          color: K.ink,
          boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
        }}
      >
        {text}
        <span style={{ fontSize: 18, color: K.muted, marginLeft: 14, whiteSpace: "nowrap" }}>
          {time}
          {out ? <span style={{ color: "#4FA3E0" }}> ✓✓</span> : null}
        </span>
      </div>
    </div>
  );
};

const Dots: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ background: "#FFF", borderRadius: 18, padding: "18px 22px", display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: K.faint, translate: `0px ${Math.sin((frame - from) / 3 - i) * 3}px` }} />
        ))}
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const current = frame < T1.send ? typed(T1.text, frame, T1.start) : frame >= T2.start && frame < T2.send ? typed(T2.text, frame, T2.start) : "";
  const typing = (frame >= T1.start && frame < T1.send) || (frame >= T2.start && frame < T2.send);
  const sendPress = (at: number) => interpolate(frame, [at - 3, at, at + 6], [1, 0.88, 1], clamp);
  return (
    <Card>
      {/* topo */}
      <div style={{ height: 104, display: "flex", alignItems: "center", gap: 18, padding: "0 28px", borderBottom: `1px solid ${K.line}` }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#FFF", border: `1px solid ${K.line}`, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          <Img src={staticFile("brand/logo_face.png")} style={{ width: 56, height: 56 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F_TEXT, fontWeight: 600, fontSize: 30, color: K.ink }}>Odontocril</div>
          <div style={{ fontFamily: F_TEXT, fontSize: 22, color: K.muted }}>{frame >= DOTS && frame < IN2 ? "digitando…" : "Atendimento"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F_TEXT, fontSize: 22, color: K.muted }}>
          <ChatIcon size={26} /> WhatsApp
        </div>
      </div>
      {/* conversa */}
      <div style={{ position: "absolute", top: 104, left: 0, right: 0, bottom: 112, background: K.chatBg, padding: "26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ alignSelf: "center", background: "#FFFFFFCC", borderRadius: 10, padding: "6px 16px", fontFamily: F_TEXT, fontSize: 20, color: K.muted }}>Hoje</div>
        <Bubble at={IN1} text="Olá! Como podemos ajudar?" time="9:12" />
        <Bubble at={T1.send} out text={T1.text} time="9:13" />
        <Bubble at={T2.send} out text={T2.text} time="9:13" />
        <Dots from={DOTS} to={IN2} />
        <Bubble at={IN2} text="Ótimo! Vamos te apresentar as opções da nossa linha." time="9:14" />
      </div>
      {/* campo de mensagem */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 112, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", background: "#FFF", borderTop: `1px solid ${K.line}` }}>
        <div style={{ flex: 1, height: 68, borderRadius: 34, background: K.bg, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: F_TEXT, fontSize: 28, color: current ? K.ink : K.faint, whiteSpace: "nowrap", overflow: "hidden" }}>
          {current || "Mensagem"}
          {typing ? <Caret h={32} color={K.green} /> : null}
        </div>
        <div style={{ width: 68, height: 68, borderRadius: 34, background: K.green, display: "flex", justifyContent: "center", alignItems: "center", scale: String(Math.min(sendPress(T1.send), sendPress(T2.send))) }}>
          <svg viewBox="0 0 24 24" style={{ width: 30, height: 30 }}>
            <path d="M4 12 L20 4 L14 20 L11.5 13 Z" fill="#FFF" />
          </svg>
        </div>
      </div>
      <Cursor
        appear={70}
        keys={[
          { f: 70, x: 600, y: 560 },
          { f: T1.send - 10, x: SEND.x, y: SEND.y },
          { f: T1.send, x: SEND.x, y: SEND.y, click: true },
          { f: T2.send - 10, x: SEND.x, y: SEND.y },
          { f: T2.send, x: SEND.x, y: SEND.y, click: true },
          { f: T2.send + 30, x: 700, y: 640 },
        ]}
      />
    </Card>
  );
};

export const Passo1: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={S.passo1.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        headline={<Headline start={0} size={(vertical ? 78 : 76) * u} lines={[{ text: "Conte pra gente o que" }, { text: "o seu consultório precisa." }]} />}
        card={<Chat />}
      />
      <Sfx name="message" at={IN1} volume={0.5} />
      <Sfx name="typing" at={T1.start} dur={T1.send - T1.start - 8} volume={0.35} />
      <Sfx name="click" at={T1.send} volume={0.5} />
      <Sfx name="typing" at={T2.start} dur={T2.send - T2.start - 8} volume={0.35} />
      <Sfx name="click" at={T2.send} volume={0.5} />
      <Sfx name="message" at={IN2} volume={0.5} />
    </StepScene>
  );
};

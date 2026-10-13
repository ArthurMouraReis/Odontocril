import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F_TEXT, K } from "../../v2/theme";
import { Card, Caret, ChatIcon, clamp, Cursor, Headline, OUT, Sfx, StepLayout, StepScene, typed, useLayout } from "../../v2/ui";
import { T } from "../timeline";

const W = 920;
const H = 820;

// Conversa encenada, do ponto de vista do WhatsApp da cliente
const IN1 = 14;
const M1 = { text: "Somos a Odontocril.", start: 30, send: 60 };
const M2 = { text: "Equipamentos odontológicos e assistência técnica.", start: 70, send: 125 };
const DOTS = 134;
const IN2 = 150;
const SEND = { x: 846, y: H - 56 };

const Bubble: React.FC<{ at: number; out?: boolean; text: string; time: string }> = ({ at, out, text, time }) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  const p = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>
      <div style={{ maxWidth: 660, background: out ? K.bubbleOut : "#FFF", borderRadius: 18, padding: "16px 22px 12px", fontFamily: F_TEXT, fontSize: 30, lineHeight: 1.35, color: K.ink, boxShadow: "0 1px 1px rgba(0,0,0,0.06)" }}>
        {text}
        <span style={{ fontSize: 18, color: K.muted, marginLeft: 14, whiteSpace: "nowrap" }}>
          {time}
          {out ? <span style={{ color: "#4FA3E0" }}> ✓✓</span> : null}
        </span>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const current = frame < M1.send ? typed(M1.text, frame, M1.start) : frame >= M2.start && frame < M2.send ? typed(M2.text, frame, M2.start, 1.1) : "";
  const typing = (frame >= M1.start && frame < M1.send) || (frame >= M2.start && frame < M2.send);
  const press = (at: number) => interpolate(frame, [at - 3, at, at + 6], [1, 0.88, 1], clamp);
  return (
    <Card>
      <div style={{ height: 104, display: "flex", alignItems: "center", gap: 18, padding: "0 28px", borderBottom: `1px solid ${K.line}` }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#FFF", border: `1px solid ${K.line}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Img src={staticFile("tecvertex/symbol.png")} style={{ width: 40 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F_TEXT, fontWeight: 600, fontSize: 30, color: K.ink }}>Tecvertex</div>
          <div style={{ fontFamily: F_TEXT, fontSize: 22, color: K.muted }}>{frame >= DOTS && frame < IN2 ? "digitando…" : "Atendimento"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F_TEXT, fontSize: 22, color: K.muted }}>
          <ChatIcon size={26} /> WhatsApp
        </div>
      </div>
      <div style={{ position: "absolute", top: 104, left: 0, right: 0, bottom: 112, background: K.chatBg, padding: "26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ alignSelf: "center", background: "#FFFFFFCC", borderRadius: 10, padding: "6px 16px", fontFamily: F_TEXT, fontSize: 20, color: K.muted }}>Hoje</div>
        <Bubble at={IN1} text="Oi! Como é o seu negócio?" time="9:12" />
        <Bubble at={M1.send} out text={M1.text} time="9:13" />
        <Bubble at={M2.send} out text={M2.text} time="9:13" />
        {frame >= DOTS && frame < IN2 ? (
          <div style={{ display: "flex" }}>
            <div style={{ background: "#FFF", borderRadius: 18, padding: "18px 22px", display: "flex", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: K.faint, translate: `0px ${Math.sin((frame - DOTS) / 3 - i) * 3}px` }} />
              ))}
            </div>
          </div>
        ) : null}
        <Bubble at={IN2} text="Que bom ter vocês com a gente! Vamos começar." time="9:14" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 112, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", background: "#FFF", borderTop: `1px solid ${K.line}` }}>
        <div style={{ flex: 1, height: 68, borderRadius: 34, background: K.bg, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: F_TEXT, fontSize: 28, color: current ? K.ink : K.faint, whiteSpace: "nowrap", overflow: "hidden" }}>
          {current || "Mensagem"}
          {typing ? <Caret h={32} color={K.green} /> : null}
        </div>
        <div style={{ width: 68, height: 68, borderRadius: 34, background: K.green, display: "flex", justifyContent: "center", alignItems: "center", scale: String(Math.min(press(M1.send), press(M2.send))) }}>
          <svg viewBox="0 0 24 24" style={{ width: 30, height: 30 }}>
            <path d="M4 12 L20 4 L14 20 L11.5 13 Z" fill="#FFF" />
          </svg>
        </div>
      </div>
      <Cursor
        appear={36}
        label="Odontocril"
        keys={[
          { f: 36, x: 620, y: 600 },
          { f: M1.send - 10, x: SEND.x, y: SEND.y },
          { f: M1.send, x: SEND.x, y: SEND.y, click: true },
          { f: M2.send - 10, x: SEND.x, y: SEND.y },
          { f: M2.send, x: SEND.x, y: SEND.y, click: true },
          { f: M2.send + 30, x: 700, y: 620 },
        ]}
      />
    </Card>
  );
};

export const Conversa: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.conversa.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        headline={<Headline start={0} size={(vertical ? 80 : 76) * u} lines={[{ text: "Tudo começou com" }, { text: "uma conversa.", color: K.blue }]} />}
        card={<Chat />}
      />
      <Sfx name="message" at={IN1} volume={0.5} />
      <Sfx name="typing" at={M1.start} dur={M1.send - M1.start - 8} volume={0.35} />
      <Sfx name="click" at={M1.send} volume={0.5} />
      <Sfx name="typing" at={M2.start} dur={M2.send - M2.start - 8} volume={0.35} />
      <Sfx name="click" at={M2.send} volume={0.5} />
      <Sfx name="message" at={IN2} volume={0.5} />
    </StepScene>
  );
};

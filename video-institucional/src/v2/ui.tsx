import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { F_DISPLAY, F_SERIF, F_TEXT, K } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const u = Math.min(width, height) / 1080;
  return { vertical, u, width, height };
};

/** Efeito sonoro posicionado em um frame da cena */
export const Sfx: React.FC<{ name: "click" | "typing" | "message" | "success" | "whoosh"; at: number; dur?: number; volume?: number }> = ({ name, at, dur = 30, volume = 0.6 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none" name={`sfx ${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/* ---------------- Cabeçalho fixo ---------------- */

export const Header: React.FC<{ step: number | null; caption: string | null; visible: number; brand?: React.ReactNode }> = ({ step, caption, visible, brand }) => {
  const { vertical, u } = useLayout();
  const pad = vertical ? 80 * u : 140 * u;
  return (
    <div
      style={{
        position: "absolute",
        top: (vertical ? 120 : 64) * u,
        left: pad,
        right: pad,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: visible,
      }}
    >
      {brand ?? <Img src={staticFile("brand/logo_mark.png")} style={{ height: 74 * u }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 18 * u }}>
        {step !== null ? (
          <>
            <div style={{ fontFamily: F_TEXT, fontWeight: 500, fontSize: 26 * u, color: K.muted }}>Passo {step} de 3</div>
            <div style={{ display: "flex", gap: 6 * u }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: 34 * u, height: 4 * u, borderRadius: 2 * u, background: i <= step ? K.ink : K.line }} />
              ))}
            </div>
          </>
        ) : null}
        {caption ? (
          <div style={{ fontFamily: F_SERIF, fontStyle: "italic", fontSize: 38 * u, color: K.muted }}>{caption}</div>
        ) : null}
      </div>
    </div>
  );
};

/* ---------------- Título em linhas ---------------- */

export type Line = { text: string; color?: string };

export const Headline: React.FC<{ lines: Line[]; start: number; size: number; align?: "left" | "center"; weight?: number }> = ({ lines, start, size, align = "left", weight = 600 }) => {
  const frame = useCurrentFrame() - start;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center" }}>
      {lines.map((l, i) => {
        const p = interpolate(frame - i * 4, [0, 20], [0, 1], { ...clamp, easing: OUT });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.1, marginBottom: -size * 0.1 }}>
            <div
              style={{
                fontFamily: F_DISPLAY,
                fontWeight: weight,
                fontSize: size,
                lineHeight: 1.06,
                letterSpacing: -size * 0.035,
                color: l.color ?? K.ink,
                translate: `0px ${(1 - p) * size * 1.1}px`,
                textAlign: align,
              }}
            >
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- Cena com entrada/saída ---------------- */

export const StepScene: React.FC<{ dur: number; children: React.ReactNode; exit?: boolean }> = ({ dur, children, exit = true }) => {
  const frame = useCurrentFrame();
  const out = exit ? interpolate(frame, [dur - 10, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  return <AbsoluteFill style={{ opacity: 1 - out, translate: `0px ${-out * 40}px` }}>{children}</AbsoluteFill>;
};

/**
 * Layout padrão de um passo: título + cartão (mockup) com tamanho de design fixo.
 * O cartão é escalado para caber no quadro; as coordenadas internas (cursor) são as de design.
 */
export const StepLayout: React.FC<{ headline: React.ReactNode; card: React.ReactNode; cardW: number; cardH: number; note?: boolean }> = ({ headline, card, cardW, cardH, note }) => {
  const { vertical, u } = useLayout();
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [6, 26], [0, 1], { ...clamp, easing: OUT });
  const scale = vertical ? Math.min(1, 1180 / cardH) * u : Math.min(860 / cardH, 880 / cardW) * u;
  const cardBox = (
    <div style={{ width: cardW * scale, height: cardH * scale, opacity: enter, translate: `0px ${(1 - enter) * 80 * u}px` }}>
      <div style={{ width: cardW, height: cardH, scale: String(scale), transformOrigin: "0 0", position: "relative" }}>{card}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {vertical ? (
        <>
          <div style={{ position: "absolute", top: 300 * u, left: 80 * u, right: 80 * u }}>{headline}</div>
          <div style={{ position: "absolute", top: 610 * u, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{cardBox}</div>
        </>
      ) : (
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: `${150 * u}px ${140 * u}px ${60 * u}px` }}>
          <div style={{ width: 760 * u }}>{headline}</div>
          {cardBox}
        </AbsoluteFill>
      )}
      {note ? <IllustrativeNote /> : null}
    </AbsoluteFill>
  );
};

export const IllustrativeNote: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <div style={{ position: "absolute", bottom: (vertical ? 80 : 40) * u, left: (vertical ? 80 : 140) * u, fontFamily: F_TEXT, fontSize: 22 * u, color: K.faint }}>
      Imagens ilustrativas
    </div>
  );
};

/* ---------------- Cartão ---------------- */

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: K.card,
      borderRadius: 28,
      boxShadow: "0 40px 80px -30px rgba(17,19,21,0.18), 0 2px 6px rgba(17,19,21,0.05)",
      border: `1px solid ${K.line}`,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------------- Cursor ---------------- */

export type CursorKey = { f: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ keys: CursorKey[]; appear?: number; hide?: number; label?: string }> = ({ keys, appear = keys[0].f, hide = 100000, label }) => {
  const frame = useCurrentFrame();
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], { ...clamp, easing: INOUT });
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p - Math.sin(p * Math.PI) * Math.min(60, Math.abs(b.x - a.x) * 0.12);
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  let press = 0;
  for (const k of keys) if (k.click) press = Math.max(press, interpolate(frame, [k.f - 3, k.f, k.f + 5], [0, 1, 0], clamp));
  const opacity = interpolate(frame, [appear, appear + 8, hide, hide + 8], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 50, pointerEvents: "none" }}>
      {keys.map((k, i) =>
        k.click ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -26,
              top: -26,
              width: 52,
              height: 52,
              borderRadius: 26,
              border: `3px solid ${K.blue}`,
              opacity: interpolate(frame, [k.f, k.f + 14], [0.7, 0], clamp) * (frame >= k.f ? 1 : 0),
              scale: String(interpolate(frame, [k.f, k.f + 14], [0.3, 1.3], clamp)),
            }}
          />
        ) : null,
      )}
      <svg viewBox="0 0 20 28" style={{ width: 40, height: 56, scale: String(1 - press * 0.15), transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}>
        <path d="M1 1 L1 22 L6.5 17 L10.5 26 L14 24.5 L10 15.8 L17.5 15.8 Z" fill={K.ink} stroke="#FFFFFF" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      {label ? (
        <div style={{ position: "absolute", left: 30, top: 44, background: K.blue, color: "#FFF", fontFamily: F_TEXT, fontWeight: 600, fontSize: 20, padding: "4px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>{label}</div>
      ) : null}
    </div>
  );
};

/* ---------------- Digitação ---------------- */

export const typed = (text: string, frame: number, start: number, cpf = 1) => text.slice(0, Math.max(0, Math.floor((frame - start) * cpf)));

export const Caret: React.FC<{ color?: string; h: number }> = ({ color = K.blue, h }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 3, height: h, background: color, marginLeft: 2, verticalAlign: "middle", opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }} />;
};

/* ---------------- Ícones ---------------- */

export const ChatIcon: React.FC<{ size: number; color?: string }> = ({ size, color = K.green }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <path d="M9 8.5c.3-.6.8-.6 1.1 0l.6 1.4c.1.3 0 .6-.2.8l-.5.5c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.2-.2.5-.3.8-.2l1.4.6c.6.3.6.8 0 1.1-.9.6-2 .8-3 .2a8.5 8.5 0 0 1-3.7-3.7c-.6-1-.4-2.1.2-3z" fill={color} />
  </svg>
);

export const Check: React.FC<{ size: number; p: number; bg?: string }> = ({ size, p, bg = K.blue }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size, flexShrink: 0 }}>
    <circle cx={12} cy={12} r={11} fill={bg} opacity={Math.min(1, p * 2)} />
    <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

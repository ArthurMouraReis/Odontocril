import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { F_TEXT, K } from "../v2/theme";
import { clamp, INOUT, OUT } from "../v2/ui";

/**
 * Captura real do Tecvertex Gestão (1920 × 1080 em px CSS) vista por uma "câmera":
 * cada chave define o ponto da tela no centro do quadro e o zoom.
 */
export const SCREEN_W = 1920;
export const SCREEN_H = 1080;

export type Cam = { f: number; x: number; y: number; s: number };

export const camAt = (keys: Cam[], frame: number) => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], { ...clamp, easing: INOUT });
      return { f: frame, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, s: a.s + (b.s - a.s) * p };
    }
  }
  return keys[keys.length - 1];
};

/** Converte um ponto da tela para o quadro visível (largura vw × altura vh) */
export const project = (cam: Cam, vw: number, vh: number, x: number, y: number) => ({ x: (x - cam.x) * cam.s + vw / 2, y: (y - cam.y) * cam.s + vh / 2 });

/** Camadas de captura com troca suave (crossfade) entre telas */
export const Shots: React.FC<{ cam: Cam; vw: number; vh: number; layers: { src: string; from: number; fade?: number }[]; children?: React.ReactNode }> = ({ cam, vw, vh, layers, children }) => {
  const frame = useCurrentFrame();
  const left = vw / 2 - cam.x * cam.s;
  const top = vh / 2 - cam.y * cam.s;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#060912" }}>
      <div style={{ position: "absolute", left, top, width: SCREEN_W, height: SCREEN_H, scale: String(cam.s), transformOrigin: "0 0" }}>
        {layers.map(({ src, from, fade = 8 }) =>
          frame >= from ? (
            <Img key={src} src={staticFile(`tecvertex/gestao/${src}`)} style={{ position: "absolute", inset: 0, width: SCREEN_W, height: SCREEN_H, opacity: interpolate(frame, [from, from + fade], [0, 1], clamp) }} />
          ) : null,
        )}
        {children}
      </div>
    </div>
  );
};

/** Moldura de destaque desenhada sobre a captura (em coordenadas da tela) */
export const Highlight: React.FC<{ x: number; y: number; w: number; h: number; at: number; until?: number; color?: string; radius?: number }> = ({ x, y, w, h, at, until = 100000, color = K.blue, radius = 14 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12, until, until + 8], [0, 1, 1, 0], clamp);
  const grow = interpolate(frame, [at, at + 14], [1.06, 1], { ...clamp, easing: OUT });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 8,
        top: y - 8,
        width: w + 16,
        height: h + 16,
        borderRadius: radius,
        border: `3px solid ${color}`,
        boxShadow: `0 0 0 9999px rgba(4,8,16,${0.45 * p}), 0 0 30px ${color}66`,
        opacity: p,
        scale: String(grow),
      }}
    />
  );
};

/** Etiqueta flutuante em coordenadas da tela */
export const Tag: React.FC<{ x: number; y: number; at: number; children: React.ReactNode; bg?: string }> = ({ x, y, at, children, bg = K.blue }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: OUT });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p, translate: `0px ${(1 - p) * 12}px`, background: bg, color: "#FFF", fontFamily: F_TEXT, fontWeight: 600, fontSize: 18, padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
      {children}
    </div>
  );
};

/** Janela de navegador escura para o sistema */
export const AppWindow: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: "#0B1020", boxShadow: "0 40px 80px -30px rgba(17,19,21,0.45), 0 2px 6px rgba(17,19,21,0.08)" }}>
    <div style={{ height: 60, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "#111827", borderBottom: "1px solid #1F2937" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
      </div>
      <div style={{ flex: 1, height: 34, borderRadius: 9, background: "#0B1020", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_TEXT, fontSize: 18, color: "#94A3B8" }}>{url}</div>
    </div>
    <div style={{ position: "absolute", top: 60, left: 0, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

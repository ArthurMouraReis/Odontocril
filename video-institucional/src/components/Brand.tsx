import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Escala base: 1 = 1080 px no menor lado do quadro */
export const useUnit = () => {
  const { width, height } = useVideoConfig();
  return { u: Math.min(width, height) / 1080, vertical: height > width, width, height };
};

/**
 * Logo oficial (arquivo enviado pela empresa, ampliado sem redesenho),
 * animada em camadas: mascote → nome → slogan.
 */
export const Logo: React.FC<{ start: number; width: number; showTagline?: boolean }> = ({ start, width, showTagline = true }) => {
  const frame = useCurrentFrame() - start;
  const ratio = 1328 / 2960;
  const layer: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  return (
    <div style={{ position: "relative", width, height: width * ratio }}>
      <Img
        src={staticFile("brand/logo_mascot.png")}
        style={{
          ...layer,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          scale: interpolate(frame, [0, 26], [0.86, 1], { ...clamp, easing: Easing.bezier(0.34, 1.4, 0.64, 1) }),
          transformOrigin: "50% 30%",
        }}
      />
      <Img
        src={staticFile("brand/logo_word.png")}
        style={{
          ...layer,
          opacity: interpolate(frame, [10, 24], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [10, 30], [width * 0.03, 0], { ...clamp, easing: OUT })}px`,
          clipPath: `inset(0 ${interpolate(frame, [10, 30], [100, 0], { ...clamp, easing: OUT })}% 0 0)`,
        }}
      />
      {showTagline ? (
        <Img
          src={staticFile("brand/logo_tagline.png")}
          style={{
            ...layer,
            opacity: interpolate(frame, [22, 36], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [22, 40], [width * 0.02, 0], { ...clamp, easing: OUT })}px`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Fundo claro, com luz difusa e grade técnica sutil */
export const LightBackdrop: React.FC<{ drift?: number }> = ({ drift = 1 }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const x = 50 + Math.sin(frame / 90) * 6 * drift;
  const y = 30 + Math.cos(frame / 110) * 4 * drift;
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${x}% ${y}%, #FFFFFF 0%, ${C.paper} 45%, ${C.mist} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.blue}0D 1px, transparent 1px), linear-gradient(90deg, ${C.blue}0D 1px, transparent 1px)`,
          backgroundSize: `${60 * u}px ${60 * u}px`,
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Fundo azul institucional profundo */
export const DeepBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 30 + Math.sin(frame / 80) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at ${x}% 20%, ${C.blueDeep} 0%, ${C.navy} 55%, ${C.navyDark} 100%)`,
      }}
    />
  );
};

/** Texto que sobe palavra por palavra por trás de uma máscara */
export const RiseText: React.FC<{
  text: string;
  start: number;
  size: number;
  color?: string;
  weight?: number;
  font?: string;
  stagger?: number;
  align?: "left" | "center";
  lineHeight?: number;
  highlight?: string[];
  highlightColor?: string;
  maxWidth?: number;
}> = ({ text, start, size, color = C.ink, weight = 800, font = FONT_TITLE, stagger = 3, align = "center", lineHeight = 1.12, highlight = [], highlightColor = C.blue, maxWidth }) => {
  const frame = useCurrentFrame() - start;
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        letterSpacing: weight >= 700 ? -size * 0.02 : 0,
        maxWidth,
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const t = frame - i * stagger;
        const clean = w.replace(/[.,]/g, "");
        return (
          <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: size * 0.08 }}>
            <span
              style={{
                display: "inline-block",
                translate: `0px ${interpolate(t, [0, 18], [size * 1.1, 0], { ...clamp, easing: OUT })}px`,
                color: highlight.includes(clean) ? highlightColor : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Pequeno rótulo em caixa alta com traço azul */
export const Eyebrow: React.FC<{ text: string; start: number; color?: string; size?: number; align?: "left" | "center" }> = ({ text, start, color = C.blue, size = 30, align = "center" }) => {
  const frame = useCurrentFrame() - start;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: size * 0.6,
        opacity: interpolate(frame, [0, 12], [0, 1], clamp),
      }}
    >
      <div style={{ height: Math.max(2, size * 0.1), width: interpolate(frame, [0, 20], [0, size * 2], { ...clamp, easing: OUT }), background: color }} />
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: size, letterSpacing: size * 0.22, color, textTransform: "uppercase" }}>{text}</div>
    </div>
  );
};

export const FadeIn: React.FC<{ start: number; dur?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ start, dur = 16, y = 24, children, style }) => {
  const frame = useCurrentFrame() - start;
  return (
    <div
      style={{
        opacity: interpolate(frame, [0, dur], [0, 1], clamp),
        translate: `0px ${interpolate(frame, [0, dur + 8], [y, 0], { ...clamp, easing: OUT })}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Aviso discreto de imagens ilustrativas */
export const IllustrativeNote: React.FC<{ light?: boolean }> = ({ light }) => {
  const { u, vertical } = useUnit();
  return (
    <div
      style={{
        position: "absolute",
        bottom: (vertical ? 70 : 40) * u,
        right: (vertical ? 60 : 60) * u,
        fontFamily: FONT_BODY,
        fontSize: 22 * u,
        color: light ? "#FFFFFF88" : `${C.inkSoft}AA`,
        letterSpacing: 1,
      }}
    >
      Imagens ilustrativas
    </div>
  );
};

/** Movimento de câmera: aproximação lenta e contínua */
export const CameraPush: React.FC<{ from?: number; to?: number; dur: number; children: React.ReactNode; origin?: string }> = ({ from = 1, to = 1.08, dur, children, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ scale: interpolate(frame, [0, dur], [from, to], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) }), transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
};

/** Crossfade de entrada de cada cena */
export const SceneIn: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, frames], [0, 1], clamp),
        scale: interpolate(frame, [0, frames * 2], [1.03, 1], { ...clamp, easing: OUT }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

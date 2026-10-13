import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, OUT } from "../v2/ui";

// Arquivos extraídos do comercial oficial da Tecvertex (fundo removido, sem redesenho)
const SYMBOL = { w: 308, h: 257 };
const WORD = { w: 646, h: 63 };
const TAG = { w: 624, h: 32 };

export const TecvertexMini: React.FC<{ u: number }> = ({ u }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 * u }}>
    <Img src={staticFile("tecvertex/symbol.png")} style={{ height: 46 * u }} />
    <Img src={staticFile("tecvertex/wordmark.png")} style={{ height: 22 * u }} />
  </div>
);

/** Logo completa animada: símbolo → nome → slogan */
export const TecvertexLogo: React.FC<{ start: number; width: number; tagline?: boolean }> = ({ start, width, tagline = true }) => {
  const f = useCurrentFrame() - start;
  const k = width / WORD.w;
  const sym = interpolate(f, [0, 22], [0, 1], { ...clamp, easing: OUT });
  const word = interpolate(f, [10, 32], [0, 1], { ...clamp, easing: OUT });
  const tag = interpolate(f, [24, 40], [0, 1], clamp);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 * k }}>
      <Img
        src={staticFile("tecvertex/symbol.png")}
        style={{ width: SYMBOL.w * k * 0.92, height: SYMBOL.h * k * 0.92, opacity: sym, scale: String(0.85 + 0.15 * sym), translate: `0px ${(1 - sym) * 30 * k}px` }}
      />
      <Img src={staticFile("tecvertex/wordmark.png")} style={{ width: WORD.w * k, height: WORD.h * k, opacity: word, clipPath: `inset(0 ${(1 - word) * 100}% 0 0)` }} />
      {tagline ? <Img src={staticFile("tecvertex/tagline.png")} style={{ width: TAG.w * k, height: TAG.h * k, opacity: tag, marginTop: -14 * k }} /> : null}
    </div>
  );
};

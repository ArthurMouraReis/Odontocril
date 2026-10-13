import React, { createContext, useContext } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/**
 * Animação de "traço sendo desenhado". Cada elemento <D.*> recebe um índice
 * e é desenhado em sequência dentro da janela [start, start + dur].
 */
type DrawCtx = { start: number; dur: number; count: number; color: string; width: number };
const Ctx = createContext<DrawCtx>({ start: 0, dur: 30, count: 1, color: C.line, width: 3 });

export const DrawGroup: React.FC<{
  start: number;
  dur: number;
  count: number;
  color?: string;
  width?: number;
  children: React.ReactNode;
}> = ({ start, dur, count, color = C.line, width = 3, children }) => (
  <Ctx.Provider value={{ start, dur, count, color, width }}>{children}</Ctx.Provider>
);

const useProgress = (i: number) => {
  const frame = useCurrentFrame();
  const { start, dur, count } = useContext(Ctx);
  const slot = dur / Math.max(count, 1);
  const s0 = start + i * slot * 0.55;
  const s1 = s0 + Math.max(slot * 1.8, 10);
  return interpolate(frame, [s0, s1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
};

const strokeProps = (p: number, color: string, width: number) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - p,
  fill: "none",
  stroke: color,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  opacity: p > 0 ? 1 : 0,
});

type Common = { i: number; color?: string; w?: number; fillColor?: string };

const useStroke = ({ i, color, w }: Common) => {
  const ctx = useContext(Ctx);
  const p = useProgress(i);
  return { p, props: strokeProps(p, color ?? ctx.color, w ?? ctx.width) };
};

// Preenchimento suave que aparece depois do traço
const fillOpacity = (p: number) => interpolate(p, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const D = {
  Path: ({ d, fillColor, ...c }: Common & { d: string }) => {
    const { p, props } = useStroke(c);
    return (
      <>
        {fillColor ? <path d={d} fill={fillColor} opacity={fillOpacity(p)} /> : null}
        <path d={d} {...props} />
      </>
    );
  },
  Rect: ({ x, y, width, height, rx = 0, transform, fillColor, ...c }: Common & {
    x: number; y: number; width: number; height: number; rx?: number; transform?: string;
  }) => {
    const { p, props } = useStroke(c);
    return (
      <g transform={transform}>
        {fillColor ? <rect x={x} y={y} width={width} height={height} rx={rx} fill={fillColor} opacity={fillOpacity(p)} /> : null}
        <rect x={x} y={y} width={width} height={height} rx={rx} {...props} />
      </g>
    );
  },
  Circle: ({ cx, cy, r, fillColor, ...c }: Common & { cx: number; cy: number; r: number }) => {
    const { p, props } = useStroke(c);
    return (
      <>
        {fillColor ? <circle cx={cx} cy={cy} r={r} fill={fillColor} opacity={fillOpacity(p)} /> : null}
        <circle cx={cx} cy={cy} r={r} {...props} />
      </>
    );
  },
  Ellipse: ({ cx, cy, rx, ry, fillColor, ...c }: Common & { cx: number; cy: number; rx: number; ry: number }) => {
    const { p, props } = useStroke(c);
    return (
      <>
        {fillColor ? <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fillColor} opacity={fillOpacity(p)} /> : null}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...props} />
      </>
    );
  },
};

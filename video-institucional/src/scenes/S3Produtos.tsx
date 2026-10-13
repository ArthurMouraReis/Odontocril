import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Eyebrow, IllustrativeNote, LightBackdrop, RiseText, useUnit } from "../components/Brand";
import { Chair, CuringLight, Ultrasound, VacuumPump } from "../components/Illustrations";
import { Visual } from "../components/Visual";
import { MEDIA } from "../media";
import { C, FONT_BODY, FONT_TITLE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN = Easing.bezier(0.7, 0, 0.84, 0);

const CARD = 66; // 2,2 s por equipamento
const FIRST = 40;

type Item = { title: string; media: keyof typeof MEDIA; art: (start: number) => React.ReactNode };
const ITEMS: Item[] = [
  { title: "Consultórios e cadeiras", media: "cadeira", art: (s) => <Chair start={s} dur={34} lamp={0} /> },
  { title: "Ultrassom", media: "ultrassom", art: (s) => <Ultrasound start={s} dur={34} /> },
  { title: "Bombas de vácuo", media: "vacuo", art: (s) => <VacuumPump start={s} dur={34} /> },
  { title: "Fotopolimerizadores", media: "fotopolimerizador", art: (s) => <CuringLightGlow start={s} /> },
];

const CuringLightGlow: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  return <CuringLight start={start} dur={30} glow={interpolate(f, [start + 30, start + 44], [0, 1], clamp)} />;
};

const Card: React.FC<{ item: Item; index: number; start: number; last: boolean }> = ({ item, index, start, last }) => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const f = frame - start;
  const enter = interpolate(f, [0, 20], [0, 1], { ...clamp, easing: OUT });
  const exit = last ? 0 : interpolate(f, [CARD - 10, CARD + 4], [0, 1], { ...clamp, easing: IN });
  if (f < -2 || (!last && f > CARD + 6)) return null;
  const dx = (1 - enter) * 160 * u - exit * 160 * u;

  const artBox = vertical ? { w: 920, h: 690 } : { w: 960, h: 720 };
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        translate: `${dx}px 0px`,
        flexDirection: vertical ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        gap: (vertical ? 50 : 80) * u,
        paddingTop: vertical ? 220 * u : 120 * u,
      }}
    >
      <div
        style={{
          position: "relative",
          width: artBox.w * u,
          height: artBox.h * u,
          borderRadius: 36 * u,
          background: "#FFFFFF",
          boxShadow: `0 ${30 * u}px ${80 * u}px #0A3A6A1F, 0 ${4 * u}px ${12 * u}px #0A3A6A0F`,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "88%", height: "88%", scale: interpolate(f, [0, CARD], [0.98, 1.04]) }}>
          <Visual media={item.media} start={start} dur={CARD} fallback={item.art(start + 4)} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 * u, alignItems: vertical ? "center" : "flex-start", width: vertical ? undefined : 640 * u }}>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 30 * u, color: C.blue, letterSpacing: 4 }}>
          {String(index + 1).padStart(2, "0")} <span style={{ color: `${C.inkSoft}88` }}>/ {String(ITEMS.length).padStart(2, "0")}</span>
        </div>
        <RiseText text={item.title} start={start + 6} size={(vertical ? 76 : 72) * u} align={vertical ? "center" : "left"} />
      </div>
    </AbsoluteFill>
  );
};

export const S3Produtos: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const endStart = FIRST + CARD * ITEMS.length;
  const endIn = interpolate(frame, [endStart, endStart + 18], [0, 1], { ...clamp, easing: OUT });

  return (
    <AbsoluteFill>
      <LightBackdrop />
      {/* cabeçalho fixo */}
      <AbsoluteFill style={{ alignItems: vertical ? "center" : "flex-start", padding: vertical ? `${180 * u}px ${80 * u}px` : `${90 * u}px ${140 * u}px`, gap: 22 * u }}>
        <Eyebrow text="Linha de equipamentos" start={12} size={28 * u} align={vertical ? "center" : "left"} />
        <div style={{ opacity: interpolate(frame, [FIRST - 6, FIRST + 6], [1, 0], clamp), position: "absolute", top: vertical ? 760 * u : 380 * u, left: 0, right: 0 }}>
          <RiseText text="Soluções para a rotina do seu consultório." start={16} size={(vertical ? 84 : 84) * u} maxWidth={(vertical ? 900 : 1500) * u} />
        </div>
      </AbsoluteFill>

      {ITEMS.map((it, i) => (
        <Card key={it.title} item={it} index={i} start={FIRST + i * CARD} last={false} />
      ))}

      {/* fechamento da sequência: demais itens do catálogo */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: endIn, flexDirection: "column", gap: 30 * u }}>
        {frame >= endStart - 2 ? (
          <>
            <RiseText text="E outros equipamentos e acessórios odontológicos." start={endStart} size={(vertical ? 80 : 76) * u} maxWidth={(vertical ? 900 : 1300) * u} highlight={["acessórios", "equipamentos"]} />
            <div style={{ fontFamily: FONT_BODY, fontSize: 36 * u, color: C.inkSoft, opacity: interpolate(frame, [endStart + 14, endStart + 28], [0, 1], clamp) }}>
              Consulte o catálogo completo.
            </div>
          </>
        ) : null}
      </AbsoluteFill>
      <IllustrativeNote />
    </AbsoluteFill>
  );
};

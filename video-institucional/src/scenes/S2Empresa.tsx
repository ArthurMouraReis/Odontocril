import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DeepBackdrop, Eyebrow, RiseText, useUnit } from "../components/Brand";
import { C, FONT_TITLE } from "../theme";
import { local, voStart, wordAt } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

const Pillar: React.FC<{ word: string; at: number; size: number; index: number }> = ({ word, at, size, index }) => {
  const f = useCurrentFrame() - at;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.45, opacity: interpolate(f, [0, 10], [0, 1], clamp) }}>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 600, fontSize: size * 0.42, color: C.blue, width: size * 0.9, letterSpacing: 2 }}>
        {String(index).padStart(2, "0")}
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: size,
            color: "#FFFFFF",
            letterSpacing: -size * 0.02,
            translate: `${interpolate(f, [0, 18], [-size * 0.6, 0], { ...clamp, easing: OUT })}px 0px`,
          }}
        >
          {word}
        </div>
      </div>
    </div>
  );
};

export const S2Empresa: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const vo = local("empresa", voStart("n1"));
  const ring = interpolate(frame, [0, 240], [0, 40]);

  const words: [string, string][] = [
    ["Tecnologia", "tecnologia"],
    ["Qualidade", "qualidade"],
    ["Confiança", "confiança"],
  ];

  return (
    <AbsoluteFill>
      <DeepBackdrop />
      {/* anel inspirado no "O" do mascote */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1500 * u,
            height: 1500 * u,
            borderRadius: "50%",
            border: `${2 * u}px solid ${C.blue}40`,
            translate: `${vertical ? 380 * u : 620 * u}px ${vertical ? -560 * u : -120 * u}px`,
            rotate: `${ring}deg`,
            opacity: interpolate(frame, [0, 30], [0, 1], clamp),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: vertical ? `${260 * u}px ${90 * u}px` : `${120 * u}px ${160 * u}px`,
          flexDirection: vertical ? "column" : "row",
          justifyContent: vertical ? "space-between" : "space-between",
          alignItems: vertical ? "flex-start" : "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 40 * u, maxWidth: (vertical ? 900 : 900) * u }}>
          <Eyebrow text="Odontocril" start={14} align="left" size={30 * u} />
          <RiseText text="Equipamentos odontológicos" start={20} size={(vertical ? 96 : 92) * u} color="#FFFFFF" align="left" />
          <RiseText text="e assistência técnica." start={30} size={(vertical ? 96 : 92) * u} color={C.blue} align="left" />
          <div style={{ height: 2 * u, width: interpolate(frame, [vo, vo + 30], [0, 220 * u], { ...clamp, easing: OUT }), background: "#FFFFFF55", marginTop: 20 * u }} />
          <RiseText
            text="Por trás de cada consultório bem equipado, a escolha certa."
            start={vo + 2}
            size={(vertical ? 46 : 40) * u}
            weight={500}
            stagger={2}
            color="#FFFFFFCC"
            align="left"
            lineHeight={1.3}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 * u, marginBottom: vertical ? 80 * u : 0 }}>
          {words.map(([label, spoken], i) => (
            <Pillar key={label} word={label} index={i + 1} size={(vertical ? 92 : 80) * u} at={vo + wordAt("n1", spoken) - 4} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

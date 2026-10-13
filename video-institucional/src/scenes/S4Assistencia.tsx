import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Eyebrow, FadeIn, IllustrativeNote, RiseText, useUnit } from "../components/Brand";
import { Chair, CuringLight, Tools, Ultrasound, VacuumPump } from "../components/Illustrations";
import { Visual } from "../components/Visual";
import { C, FONT_BODY } from "../theme";
import { local, voStart } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const S4Assistencia: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const vo = local("assistencia", voStart("n3"));
  const badge = (vertical ? 640 : 600) * u;
  const ringP = interpolate(frame, [6, 50], [0, 1], { ...clamp, easing: OUT });
  const thumbs = [Chair, Ultrasound, VacuumPump, CuringLight];

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <AbsoluteFill style={{ background: `linear-gradient(${vertical ? 180 : 90}deg, ${C.mist} 0%, #FFFFFF 60%)` }} />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: (vertical ? 80 : 120) * u,
          padding: 90 * u,
        }}
      >
        {/* selo com as ferramentas */}
        <div style={{ position: "relative", width: badge, height: badge }}>
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, rotate: `${-90 + frame * 0.15}deg` }}>
            <circle cx={50} cy={50} r={48} fill="#FFFFFF" />
            <circle cx={50} cy={50} r={48} fill="none" stroke={C.blue} strokeWidth={0.8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ringP} />
            <circle cx={50} cy={50} r={44} fill="none" stroke={`${C.blue}33`} strokeWidth={0.3} strokeDasharray="0.6 1.4" />
          </svg>
          <div style={{ position: "absolute", inset: "14%" }}>
            <Visual media="assistencia" start={0} dur={300} radius={badge} fallback={<Tools start={14} dur={44} width={5} />} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 * u, alignItems: vertical ? "center" : "flex-start", maxWidth: (vertical ? 920 : 820) * u }}>
          <Eyebrow text="Suporte" start={16} size={28 * u} align={vertical ? "center" : "left"} />
          <RiseText text="Assistência técnica" start={22} size={(vertical ? 104 : 96) * u} align={vertical ? "center" : "left"} />
          <FadeIn start={vo + 60}>
            <div style={{ fontFamily: FONT_BODY, fontSize: (vertical ? 46 : 40) * u, lineHeight: 1.35, color: C.inkSoft, textAlign: vertical ? "center" : "left" }}>
              Cuidado com soluções essenciais para o seu consultório.
            </div>
          </FadeIn>
          {/* miniaturas dos equipamentos */}
          <div style={{ display: "flex", gap: 22 * u, marginTop: 30 * u }}>
            {thumbs.map((Art, i) => (
              <FadeIn key={i} start={vo + 110 + i * 6} y={16}>
                <div
                  style={{
                    width: 150 * u,
                    height: 120 * u,
                    borderRadius: 22 * u,
                    background: "#FFFFFF",
                    boxShadow: `0 ${10 * u}px ${30 * u}px #0A3A6A18`,
                    padding: 12 * u,
                  }}
                >
                  <Art start={vo + 110 + i * 6} dur={24} width={9} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <IllustrativeNote />
    </AbsoluteFill>
  );
};

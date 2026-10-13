import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CameraPush, LightBackdrop, Logo, RiseText, useUnit } from "../components/Brand";
import { Chair } from "../components/Illustrations";
import { Visual } from "../components/Visual";
import { C } from "../theme";
import { seqDur } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const S1Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const dur = seqDur("abertura");
  const lamp = interpolate(frame, [30, 52], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  // o consultório recua para dar espaço à marca
  const recede = interpolate(frame, [44, 70], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });

  return (
    <AbsoluteFill>
      <LightBackdrop />
      <CameraPush from={1.02} to={1.14} dur={dur} origin="50% 40%">
        <AbsoluteFill
          style={{
            opacity: interpolate(recede, [0, 1], [1, 0.16]),
            filter: `blur(${recede * 6 * u}px)`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: (vertical ? 1040 : 1300) * u, height: (vertical ? 780 : 975) * u, translate: `0px ${vertical ? -120 * u : 0}px` }}>
            <Visual media="consultorio" start={0} dur={dur} radius={24 * u} fallback={<Chair start={0} dur={40} lamp={lamp} width={3.5} />} />
          </div>
        </AbsoluteFill>
      </CameraPush>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 70 * u, flexDirection: "column" }}>
        <Logo start={50} width={(vertical ? 900 : 980) * u} />
        <div style={{ maxWidth: (vertical ? 900 : 1400) * u }}>
          <RiseText
            text="Tecnologia e confiança para a odontologia."
            start={72}
            size={(vertical ? 72 : 64) * u}
            weight={700}
            color={C.ink}
            highlight={["Tecnologia", "confiança"]}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

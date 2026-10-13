import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { MEDIA } from "../media";

/**
 * Mostra a foto real (se cadastrada em src/media.ts) com movimento de câmera
 * suave; caso contrário, mostra a ilustração passada como fallback.
 */
export const Visual: React.FC<{
  media: keyof typeof MEDIA;
  start: number;
  dur: number;
  radius?: number;
  fallback: React.ReactNode;
}> = ({ media, start, dur, radius = 0, fallback }) => {
  const frame = useCurrentFrame() - start;
  const file = MEDIA[media];
  if (!file) return <>{fallback}</>;
  return (
    <AbsoluteFill style={{ borderRadius: radius, overflow: "hidden" }}>
      <Img
        src={staticFile(`media/${file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, dur], [1.04, 1.12], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.67, 1),
          }),
        }}
      />
    </AbsoluteFill>
  );
};

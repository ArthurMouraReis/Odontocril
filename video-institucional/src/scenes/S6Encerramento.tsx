import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FadeIn, LightBackdrop, Logo, RiseText, useUnit } from "../components/Brand";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { local, voStart, wordAt } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CONTATOS = {
  instagram: "@odontocril_venda",
  site: "odontocril.com.br",
  telefone: "(48) 99162-7570",
};

const Icon: React.FC<{ kind: "instagram" | "site" | "phone"; size: number }> = ({ kind, size }) => {
  const common = { fill: "none", stroke: "#FFFFFF", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: C.blue, display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" style={{ width: size * 0.56, height: size * 0.56 }}>
        {kind === "instagram" ? (
          <>
            <rect x={3} y={3} width={18} height={18} rx={5} {...common} />
            <circle cx={12} cy={12} r={4.2} {...common} />
            <circle cx={17.3} cy={6.7} r={0.9} fill="#FFFFFF" />
          </>
        ) : kind === "site" ? (
          <>
            <circle cx={12} cy={12} r={9} {...common} />
            <path d="M3 12 H21 M12 3 C 8 7, 8 17, 12 21 M12 3 C 16 7, 16 17, 12 21" {...common} />
          </>
        ) : (
          <path
            d="M5 4 h3.5 l1.6 4.3 -2.2 1.5 a11 11 0 0 0 6.3 6.3 l1.5 -2.2 4.3 1.6 V19 a1.6 1.6 0 0 1 -1.7 1.6 A15.6 15.6 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4 z"
            {...common}
          />
        )}
      </svg>
    </div>
  );
};

const Row: React.FC<{ kind: "instagram" | "site" | "phone"; label: string; value: string; start: number }> = ({ kind, label, value, start }) => {
  const { u } = useUnit();
  return (
    <FadeIn start={start} y={20}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 * u }}>
        <Icon kind={kind} size={84 * u} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 26 * u, color: C.inkSoft, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 50 * u, color: C.ink, letterSpacing: -0.5 }}>{value}</div>
        </div>
      </div>
    </FadeIn>
  );
};

export const S6Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useUnit();
  const vo = local("encerramento", voStart("n5"));
  const ctaAt = vo + wordAt("n5", "Entre") - 10;
  const lineP = interpolate(frame, [ctaAt - 10, ctaAt + 20], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const brand = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 * u }}>
      <Logo start={14} width={(vertical ? 900 : 860) * u} />
      <RiseText text="Equipamentos odontológicos e assistência técnica." start={vo + wordAt("n5", "Equipamentos") - 4} size={(vertical ? 50 : 44) * u} weight={600} stagger={2} maxWidth={(vertical ? 860 : 820) * u} color={C.ink} />
    </div>
  );

  const contact = (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 * u, alignItems: "flex-start" }}>
      <div style={{ height: 3 * u, width: lineP * 160 * u, background: C.red }} />
      <RiseText text="Entre em contato e conheça nossas soluções." start={ctaAt} size={(vertical ? 54 : 46) * u} weight={700} stagger={2} align="left" color={C.blueDeep} maxWidth={(vertical ? 860 : 700) * u} />
      <div style={{ display: "flex", flexDirection: "column", gap: 26 * u, marginTop: 10 * u }}>
        <Row kind="instagram" label="Instagram" value={CONTATOS.instagram} start={ctaAt + 18} />
        <Row kind="site" label="Site" value={CONTATOS.site} start={ctaAt + 26} />
        <Row kind="phone" label="Telefone / WhatsApp" value={CONTATOS.telefone} start={ctaAt + 34} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <LightBackdrop drift={0.6} />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: (vertical ? 90 : 140) * u,
          padding: 90 * u,
          // a marca sobe para dar espaço aos contatos
          translate: vertical
            ? `0px ${interpolate(frame, [ctaAt - 30, ctaAt + 10], [330 * u, 0], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) })}px`
            : `${interpolate(frame, [ctaAt - 30, ctaAt + 10], [420 * u, 0], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) })}px 0px`,
        }}
      >
        {brand}
        <div style={{ opacity: frame >= ctaAt - 12 ? 1 : 0 }}>{contact}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

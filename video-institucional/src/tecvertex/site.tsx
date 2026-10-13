import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Chair, CuringLight, Tools, Ultrasound, VacuumPump } from "../components/Illustrations";
import { CONTATOS } from "../v2/scenes/Final";
import { F_DISPLAY, F_TEXT, K } from "../v2/theme";
import { ChatIcon, clamp, OUT } from "../v2/ui";

/**
 * Mockup do site da Odontocril (desktop e celular).
 * Ilustrativo: substitua por capturas reais do site quando estiver no ar.
 */

const NAVY = "#062B4A";
const PRODUCTS = [
  { name: "Consultórios e cadeiras", Art: Chair },
  { name: "Ultrassom", Art: Ultrasound },
  { name: "Bombas de vácuo", Art: VacuumPump },
  { name: "Fotopolimerizadores", Art: CuringLight },
];

/** Seção que "carrega" (sobe e aparece) a partir de um frame */
const Load: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame() - at;
  const p = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: OUT });
  return <div style={{ opacity: p, translate: `0px ${(1 - p) * 30}px`, ...style }}>{children}</div>;
};

const WaButton: React.FC<{ size: number; full?: boolean; press?: number }> = ({ size, full, press = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: size * 0.4,
      background: K.green,
      color: "#FFF",
      fontFamily: F_TEXT,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.7}px ${size * 1.1}px`,
      borderRadius: size * 0.6,
      width: full ? "100%" : undefined,
      boxSizing: "border-box",
      scale: String(press),
    }}
  >
    <ChatIcon size={size * 1.2} color="#FFF" /> Falar no WhatsApp
  </div>
);

/* ----------------------------- Desktop (1440 px) ----------------------------- */

export const SITE_DESKTOP_W = 1440;

export const SiteDesktop: React.FC<{ start: number; waPress?: number }> = ({ start, waPress = 1 }) => (
  <div style={{ width: SITE_DESKTOP_W, background: "#FFFFFF", fontFamily: F_TEXT, color: K.ink }}>
    {/* navegação */}
    <Load at={start}>
      <div style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", borderBottom: `1px solid ${K.line}` }}>
        <Img src={staticFile("brand/logo_mark.png")} style={{ height: 58 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 20, color: K.muted, fontWeight: 500 }}>
          <span>Equipamentos</span>
          <span>Assistência técnica</span>
          <span>Contato</span>
          <WaButton size={18} press={waPress} />
        </div>
      </div>
    </Load>
    {/* hero */}
    <div style={{ display: "flex", gap: 56, padding: "72px 64px 64px", alignItems: "center" }}>
      <Load at={start + 6} style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: K.blue, letterSpacing: 2, textTransform: "uppercase" }}>Equipamentos odontológicos</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 72, lineHeight: 1.04, letterSpacing: -2.5, marginTop: 18 }}>
          Tecnologia e confiança para a odontologia.
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.5, color: K.muted, marginTop: 24, maxWidth: 560 }}>
          Equipamentos e assistência técnica para a rotina do seu consultório.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
          <div style={{ background: NAVY, color: "#FFF", fontWeight: 600, fontSize: 20, padding: "16px 26px", borderRadius: 12 }}>Ver equipamentos</div>
          <WaButton size={20} press={waPress} />
        </div>
      </Load>
      <Load at={start + 12}>
        <div style={{ width: 600, height: 470, borderRadius: 28, background: K.blueSoft, padding: 30, boxSizing: "border-box" }}>
          <Chair start={start + 14} dur={30} width={3.4} />
        </div>
      </Load>
    </div>
    {/* produtos */}
    <Load at={start + 18}>
      <div style={{ padding: "56px 64px", background: K.bg }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 44, letterSpacing: -1.2 }}>Linha de equipamentos</div>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          {PRODUCTS.map(({ name, Art }, i) => (
            <div key={name} style={{ flex: 1, background: "#FFF", borderRadius: 20, border: `1px solid ${K.line}`, padding: 18 }}>
              <div style={{ height: 200 }}>
                <Art start={start + 22 + i * 4} dur={26} width={5} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 21, marginTop: 10 }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </Load>
    {/* assistência */}
    <Load at={start + 24}>
      <div style={{ margin: "56px 64px", borderRadius: 28, background: NAVY, color: "#FFF", padding: "44px 48px", display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ width: 120, height: 120, borderRadius: 24, background: "#FFFFFF14" }}>
          <Tools start={start + 26} dur={24} color="#FFFFFF" tint="transparent" width={9} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 40, letterSpacing: -1 }}>Assistência técnica</div>
          <div style={{ fontSize: 22, opacity: 0.75, marginTop: 8 }}>Cuidado com soluções essenciais para o seu consultório.</div>
        </div>
        <WaButton size={20} press={waPress} />
      </div>
    </Load>
    {/* rodapé */}
    <div style={{ padding: "36px 64px 48px", borderTop: `1px solid ${K.line}`, display: "flex", justifyContent: "space-between", fontSize: 20, color: K.muted }}>
      <span>{CONTATOS.instagram}</span>
      <span>{CONTATOS.site}</span>
      <span>{CONTATOS.telefone}</span>
    </div>
  </div>
);

/* ----------------------------- Celular (390 px) ----------------------------- */

export const SITE_MOBILE_W = 390;

export const SiteMobile: React.FC<{ start: number }> = ({ start }) => (
  <div style={{ width: SITE_MOBILE_W, background: "#FFFFFF", fontFamily: F_TEXT, color: K.ink }}>
    <div style={{ height: 96 }} />
    <Load at={start}>
      <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: `1px solid ${K.line}` }}>
        <Img src={staticFile("brand/logo_mark.png")} style={{ height: 36 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 22, height: 2.5, borderRadius: 2, background: K.ink }} />
          ))}
        </div>
      </div>
    </Load>
    <Load at={start + 5}>
      <div style={{ padding: "26px 20px 8px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: K.blue, letterSpacing: 1.5, textTransform: "uppercase" }}>Equipamentos odontológicos</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 34, lineHeight: 1.06, letterSpacing: -1.2, marginTop: 10 }}>Tecnologia e confiança para a odontologia.</div>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: K.muted, marginTop: 12 }}>Equipamentos e assistência técnica para a rotina do seu consultório.</div>
      </div>
    </Load>
    <Load at={start + 10}>
      <div style={{ margin: "14px 20px", height: 230, borderRadius: 20, background: K.blueSoft, padding: 14, boxSizing: "border-box" }}>
        <Chair start={start + 12} dur={26} width={4} />
      </div>
    </Load>
    <Load at={start + 14}>
      <div style={{ padding: "18px 20px", background: K.bg }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: -0.6 }}>Linha de equipamentos</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {PRODUCTS.map(({ name, Art }, i) => (
            <div key={name} style={{ background: "#FFF", borderRadius: 14, border: `1px solid ${K.line}`, padding: 10 }}>
              <div style={{ height: 90 }}>
                <Art start={start + 16 + i * 3} dur={22} width={7} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </Load>
    <div style={{ margin: "18px 20px", borderRadius: 18, background: NAVY, color: "#FFF", padding: 20 }}>
      <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 22 }}>Assistência técnica</div>
      <div style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>Cuidado com soluções essenciais para o seu consultório.</div>
    </div>
    <div style={{ padding: "10px 20px 140px", fontSize: 14, color: K.muted, lineHeight: 1.7 }}>
      {CONTATOS.instagram}
      <br />
      {CONTATOS.site}
      <br />
      {CONTATOS.telefone}
    </div>
  </div>
);

export const MobileWaButton: React.FC<{ press?: number }> = ({ press = 1 }) => <WaButton size={16} full press={press} />;

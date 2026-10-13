import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { F_TEXT, K } from "../../v2/theme";
import { Card, Caret, clamp, Cursor, Headline, Sfx, StepLayout, StepScene, typed, useLayout } from "../../v2/ui";
import { SITE_DESKTOP_W, SiteDesktop } from "../site";
import { T } from "../timeline";

const W = 920;
const H = 1060;
const BAR = 64;
const URL = { text: "odontocril.com.br", start: 16 };
const ENTER = 40;
const LOAD = 46;
const CLICK = 210;
const SCALE = W / SITE_DESKTOP_W;

const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const url = typed(URL.text, frame, URL.start, 0.8);
  const press = interpolate(frame, [CLICK - 3, CLICK, CLICK + 6], [1, 0.94, 1], clamp);
  // posição do botão "Falar no WhatsApp" do hero, em coordenadas do cartão
  const wa = { x: 64 * SCALE + 280 * SCALE + 80, y: BAR + (96 + 72 + 404) * SCALE };
  return (
    <Card>
      <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: K.bg, borderBottom: `1px solid ${K.line}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 38, borderRadius: 10, background: "#FFF", border: `1px solid ${K.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F_TEXT, fontSize: 20, color: K.ink }}>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
            <rect x={5} y={11} width={14} height={10} rx={2} fill={K.muted} />
            <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke={K.muted} strokeWidth={2} />
          </svg>
          {url}
          {frame < ENTER ? <Caret h={22} /> : null}
        </div>
      </div>
      {/* barra de carregamento */}
      <div style={{ position: "absolute", top: BAR - 3, left: 0, height: 3, background: K.blue, width: `${interpolate(frame, [ENTER, LOAD + 20], [0, 100], clamp)}%`, opacity: interpolate(frame, [LOAD + 20, LOAD + 30], [1, 0], clamp) }} />
      <div style={{ position: "absolute", top: BAR, left: 0, width: SITE_DESKTOP_W, scale: String(SCALE), transformOrigin: "0 0" }}>
        {frame >= LOAD ? <SiteDesktop start={LOAD} waPress={press} /> : null}
      </div>
      <Cursor
        appear={120}
        label="Cliente"
        keys={[
          { f: 120, x: 760, y: 900 },
          { f: CLICK - 16, x: wa.x, y: wa.y },
          { f: CLICK, x: wa.x, y: wa.y, click: true },
          { f: CLICK + 30, x: wa.x + 80, y: wa.y + 120 },
        ]}
      />
    </Card>
  );
};

export const Site: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={T.site.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        headline={<Headline start={0} size={(vertical ? 80 : 76) * u} lines={[{ text: "O primeiro projeto:" }, { text: "o site da Odontocril.", color: K.blue }]} />}
        card={<Browser />}
      />
      <Sfx name="typing" at={URL.start} dur={ENTER - URL.start - 4} volume={0.3} />
      <Sfx name="click" at={ENTER} volume={0.4} />
      <Sfx name="whoosh" at={LOAD} volume={0.25} />
      <Sfx name="click" at={CLICK} volume={0.5} />
    </StepScene>
  );
};

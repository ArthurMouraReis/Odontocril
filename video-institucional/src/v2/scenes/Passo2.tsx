import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chair, CuringLight, Ultrasound, VacuumPump } from "../../components/Illustrations";
import { F_DISPLAY, F_TEXT, K } from "../theme";
import { S } from "../timeline";
import { Card, ChatIcon, Check, clamp, Cursor, Headline, OUT, Sfx, StepLayout, StepScene, useLayout } from "../ui";

const W = 920;
const H = 1060;
const PAD = 32;
const GAP = 24;
const TILE_W = (W - PAD * 2 - GAP) / 2; // 416
const TILE_H = 360;
const GRID_TOP = 116;

type Item = { name: string; Art: React.FC<{ start: number; dur: number; width?: number }>; pick?: number };
const ITEMS: Item[] = [
  { name: "Cadeira odontológica", Art: Chair, pick: 75 },
  { name: "Ultrassom", Art: Ultrasound, pick: 105 },
  { name: "Bomba de vácuo", Art: VacuumPump },
  { name: "Fotopolimerizador", Art: CuringLight, pick: 135 },
];
const BUTTON_CLICK = 195;

const tilePos = (i: number) => ({ x: PAD + (i % 2) * (TILE_W + GAP), y: GRID_TOP + Math.floor(i / 2) * (TILE_H + GAP) });
const BTN = { x: W - PAD - 250, y: H - 70 };

const Tile: React.FC<{ item: Item; i: number }> = ({ item, i }) => {
  const frame = useCurrentFrame();
  const { x, y } = tilePos(i);
  const sel = item.pick !== undefined ? interpolate(frame, [item.pick, item.pick + 10], [0, 1], { ...clamp, easing: OUT }) : 0;
  const press = item.pick !== undefined ? interpolate(frame, [item.pick - 3, item.pick, item.pick + 6], [1, 0.97, 1], clamp) : 1;
  const Art = item.Art;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: TILE_W,
        height: TILE_H,
        borderRadius: 20,
        background: sel > 0 ? `rgba(232,243,253,${sel})` : "#FFFFFF",
        border: `${2 + sel}px solid ${sel > 0.5 ? K.blue : K.line}`,
        scale: String(press),
      }}
    >
      <div style={{ position: "absolute", left: 20, right: 20, top: 16, height: 250 }}>
        <Art start={12 + i * 6} dur={34} width={4.5} />
      </div>
      <div style={{ position: "absolute", left: 24, bottom: 22, fontFamily: F_TEXT, fontWeight: 600, fontSize: 28, color: K.ink }}>{item.name}</div>
      <div style={{ position: "absolute", right: 18, top: 18, opacity: sel }}>
        <Check size={40} p={sel} />
      </div>
    </div>
  );
};

const Catalog: React.FC = () => {
  const frame = useCurrentFrame();
  const count = ITEMS.filter((it) => it.pick !== undefined && frame >= it.pick).length;
  const btnPress = interpolate(frame, [BUTTON_CLICK - 3, BUTTON_CLICK, BUTTON_CLICK + 6], [1, 0.94, 1], clamp);
  const btnOn = interpolate(frame, [ITEMS[0].pick!, ITEMS[0].pick! + 10], [0.45, 1], clamp);
  const firstPick = ITEMS[0].pick!;
  const keys = [
    { f: 50, x: 640, y: 980 },
    ...ITEMS.flatMap((it, i) => {
      if (it.pick === undefined) return [];
      const { x, y } = tilePos(i);
      const c = { x: x + TILE_W * 0.55, y: y + TILE_H * 0.5 };
      return [
        { f: it.pick - 14, ...c },
        { f: it.pick, ...c, click: true },
      ];
    }),
    { f: BUTTON_CLICK - 16, x: BTN.x + 150, y: BTN.y },
    { f: BUTTON_CLICK, x: BTN.x + 150, y: BTN.y, click: true },
    { f: BUTTON_CLICK + 40, x: BTN.x + 120, y: BTN.y - 160 },
  ];
  return (
    <Card>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 30, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 600, fontSize: 38, color: K.ink, letterSpacing: -1 }}>Linha de equipamentos</div>
        <div style={{ fontFamily: F_TEXT, fontSize: 22, color: K.muted, background: K.bg, borderRadius: 10, padding: "6px 14px" }}>Odontocril</div>
      </div>
      {ITEMS.map((it, i) => (
        <Tile key={it.name} item={it} i={i} />
      ))}
      <div style={{ position: "absolute", left: PAD, top: GRID_TOP + 2 * (TILE_H + GAP) - 4, fontFamily: F_TEXT, fontSize: 24, color: K.muted }}>
        + outros equipamentos e acessórios odontológicos
      </div>
      {/* barra inferior */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, borderTop: `1px solid ${K.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${PAD}px` }}>
        <div style={{ fontFamily: F_TEXT, fontSize: 26, color: K.muted }}>
          <span style={{ fontWeight: 600, color: K.ink }}>{count}</span> {count === 1 ? "item selecionado" : "itens selecionados"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: K.ink,
            color: "#FFF",
            fontFamily: F_TEXT,
            fontWeight: 600,
            fontSize: 26,
            padding: "20px 28px",
            borderRadius: 16,
            opacity: frame < firstPick ? 0.45 : btnOn,
            scale: String(btnPress),
          }}
        >
          <ChatIcon size={30} color="#3DDC84" /> Pedir orçamento
        </div>
      </div>
      <Cursor appear={50} keys={keys} label="Você" />
    </Card>
  );
};

export const Passo2: React.FC = () => {
  const { vertical, u } = useLayout();
  return (
    <StepScene dur={S.passo2.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        headline={<Headline start={0} size={(vertical ? 78 : 76) * u} lines={[{ text: "Escolha os equipamentos" }, { text: "certos para a sua rotina.", color: K.blue }]} />}
        card={<Catalog />}
      />
      {ITEMS.map((it) => (it.pick !== undefined ? <Sfx key={it.name} name="click" at={it.pick} volume={0.5} /> : null))}
      <Sfx name="click" at={BUTTON_CLICK} volume={0.55} />
      <Sfx name="success" at={BUTTON_CLICK + 4} volume={0.35} />
    </StepScene>
  );
};

import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import meta from "../gestao-meta.json";
import { K } from "../../v2/theme";
import { clamp, Cursor, CursorKey, Headline, INOUT, Sfx, StepLayout, StepScene, useLayout } from "../../v2/ui";
import { AppWindow, Cam, camAt, Highlight, project, Shots, Tag } from "../screen";
import { T } from "../timeline";
import { H, VH, VW, W } from "./Gestao";

// Roteiro (frames locais) — tudo sobre capturas reais feitas no sistema
const GRAB = 45;
const DROP = 85;
const DIALOG = 88;
const CONFIRM = 140;
const AFTER = 146;
const STOCK = 200;
const MOVES = 252;

const { card, from, to, confirm, toast, after } = meta.funil;
const row = meta.estoque_after.row;
const mov = meta.mov.first;

const CAM: Cam[] = [
  { f: 0, x: 1290, y: 430, s: 0.92 },
  { f: DIALOG, x: 1290, y: 430, s: 0.92 },
  { f: DIALOG + 22, x: 956, y: 545, s: 1.6 },
  { f: AFTER, x: 956, y: 545, s: 1.6 },
  { f: AFTER + 24, x: 1560, y: 230, s: 1.25 },
  { f: STOCK, x: 1560, y: 230, s: 1.25 },
  { f: STOCK + 22, x: 720, y: 860, s: 1.3 },
  { f: MOVES, x: 720, y: 860, s: 1.3 },
  { f: MOVES + 22, x: 780, y: 380, s: 1.25 },
  { f: T.funil.dur, x: 780, y: 380, s: 1.27 },
];

const at = (f: number, x: number, y: number, click?: boolean): CursorKey => ({ f, ...project(camAt(CAM, f), VW, VH, x, y), click });

const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(CAM, frame);
  const drag = interpolate(frame, [GRAB, DROP], [0, 1], { ...clamp, easing: INOUT });
  const dragging = frame >= GRAB && frame < DIALOG;
  const dx = (to.x - from.x) * drag;
  const dy = (to.y - from.y) * drag;
  const lift = interpolate(frame, [GRAB, GRAB + 6, DROP - 4, DROP], [0, 1, 1, 0], clamp);
  const confirmPos = { x: confirm.x + confirm.w / 2, y: confirm.y + confirm.h / 2 };
  return (
    <AppWindow url={`Tecvertex Gestão · ${frame >= MOVES ? "Movimentações" : frame >= STOCK ? "Produtos" : "Funil de vendas"}`}>
      <Shots
        cam={cam}
        vw={VW}
        vh={VH}
        layers={[
          { src: "funil_before.jpg", from: 0, fade: 1 },
          { src: "funil_confirm.jpg", from: DIALOG, fade: 6 },
          { src: "funil_after.jpg", from: AFTER, fade: 6 },
          { src: "estoque_after.jpg", from: STOCK, fade: 8 },
          { src: "mov_after.jpg", from: MOVES, fade: 8 },
        ]}
      >
        {dragging ? (
          <>
            {/* espaço vazio deixado pelo card enquanto ele é arrastado */}
            <div style={{ position: "absolute", left: card.x - 2, top: card.y - 2, width: card.w + 4, height: card.h + 4, background: "#060912", borderRadius: 14, border: "1px dashed #1E293B" }} />
            <Img
              src={staticFile("tecvertex/gestao/card.png")}
              style={{
                position: "absolute",
                left: card.x + dx,
                top: card.y + dy,
                width: card.w,
                height: card.h,
                rotate: `${lift * 2.5}deg`,
                scale: String(1 + lift * 0.04),
                boxShadow: `0 ${20 * lift}px ${40 * lift}px rgba(0,0,0,0.6)`,
                borderRadius: 12,
              }}
            />
          </>
        ) : null}
        <Highlight x={toast.x} y={toast.y} w={toast.w} h={toast.h} at={AFTER + 26} until={STOCK - 6} color={K.green} />
        <Highlight x={after.x} y={after.y} w={after.w} h={after.h} at={AFTER + 34} until={STOCK - 6} color={K.green} />
        <Highlight x={row.x} y={row.y} w={row.w} h={row.h} at={STOCK + 22} until={MOVES - 6} />
        <Tag x={720} y={row.y - 50} at={STOCK + 30} bg={K.green}>
          Ultrassom: 7 → 6 em estoque
        </Tag>
        <Highlight x={mov.x} y={mov.y} w={mov.w} h={mov.h} at={MOVES + 22} />
        <Tag x={560} y={mov.y - 50} at={MOVES + 30}>
          Saída registrada automaticamente
        </Tag>
      </Shots>
      <Cursor
        appear={14}
        hide={AFTER + 20}
        keys={[
          at(14, 1300, 420),
          at(GRAB - 8, from.x, from.y),
          at(GRAB, from.x, from.y, true),
          at(DROP, to.x, to.y),
          at(DIALOG + 22, to.x - 40, to.y + 120),
          at(CONFIRM - 14, confirmPos.x, confirmPos.y),
          at(CONFIRM, confirmPos.x, confirmPos.y, true),
          at(CONFIRM + 20, confirmPos.x + 40, confirmPos.y + 60),
        ]}
      />
    </AppWindow>
  );
};

export const Funil: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const size = (vertical ? 80 : 76) * u;
  const swap = interpolate(frame, [AFTER - 8, AFTER], [1, 0], clamp);
  return (
    <StepScene dur={T.funil.dur}>
      <StepLayout
        cardW={W}
        cardH={H}
        note
        noteText="Dados de demonstração"
        headline={
          <div style={{ position: "relative" }}>
            <div style={{ opacity: swap }}>
              <Headline start={0} size={size} lines={[{ text: "Fechou a venda?" }, { text: "É só arrastar.", color: K.blue }]} />
            </div>
            {frame >= AFTER ? (
              <div style={{ position: "absolute", inset: 0 }}>
                <Headline start={AFTER} size={size} lines={[{ text: "E o estoque se" }, { text: "atualiza sozinho.", color: K.green }]} />
              </div>
            ) : null}
          </div>
        }
        card={<Board />}
      />
      <Sfx name="click" at={GRAB} volume={0.45} />
      <Sfx name="whoosh" at={GRAB + 4} volume={0.2} />
      <Sfx name="click" at={DROP} volume={0.4} />
      <Sfx name="click" at={CONFIRM} volume={0.5} />
      <Sfx name="success" at={AFTER + 2} volume={0.45} />
      <Sfx name="click" at={STOCK + 30} volume={0.25} />
      <Sfx name="click" at={MOVES + 30} volume={0.25} />
    </StepScene>
  );
};

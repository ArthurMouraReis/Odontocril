import React from "react";
import { C } from "../theme";
import { D, DrawGroup } from "./Draw";

/**
 * Ilustrações em traço (genéricas, sem marcas), usadas como imagens
 * ilustrativas enquanto não houver fotos reais em src/media.ts.
 * Todas usam viewBox 0 0 800 600.
 */
type Props = {
  start: number;
  dur: number;
  color?: string;
  tint?: string;
  width?: number;
  style?: React.CSSProperties;
};

const Svg: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <svg viewBox="0 0 800 600" style={{ width: "100%", height: "100%", overflow: "visible", ...style }}>
    {children}
  </svg>
);

export const Chair: React.FC<Props & { lamp?: number }> = ({ start, dur, color = C.line, tint = "#EAF4FD", width = 4, style, lamp = 0 }) => (
  <Svg style={style}>
    <defs>
      <radialGradient id="lampLight" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#FFF7DF" stopOpacity={0.95} />
        <stop offset="0.55" stopColor="#FFF3D1" stopOpacity={0.35} />
        <stop offset="1" stopColor="#FFF3D1" stopOpacity={0} />
      </radialGradient>
    </defs>
    {/* feixe de luz do refletor */}
    <path d="M286 156 L374 156 L560 420 L150 420 Z" fill="url(#lampLight)" opacity={lamp} />
    <DrawGroup start={start} dur={dur} count={16} color={color} width={width}>
      {/* base e coluna */}
      <D.Rect i={0} x={250} y={520} width={320} height={18} rx={9} fillColor={tint} />
      <D.Rect i={1} x={365} y={418} width={70} height={102} rx={12} fillColor={tint} />
      {/* assento */}
      <D.Rect i={2} x={296} y={378} width={240} height={42} rx={21} fillColor={tint} />
      {/* perneira */}
      <D.Path i={3} d="M522 384 L690 428 Q706 433 702 449 L698 460 Q693 474 678 470 L512 424 Z" fillColor={tint} />
      {/* encosto e cabeçote */}
      <D.Rect i={4} transform="translate(318 402) rotate(-142)" x={0} y={-24} width={196} height={48} rx={24} fillColor={tint} />
      <D.Rect i={5} transform="translate(318 402) rotate(-142)" x={208} y={-18} width={72} height={36} rx={18} fillColor={tint} />
      {/* braço do paciente */}
      <D.Path i={6} d="M352 356 L478 356 M462 356 L462 378" />
      {/* braço articulado e mocho de instrumentos */}
      <D.Path i={7} d="M432 446 C 520 446, 560 360, 610 318" />
      <D.Rect i={8} x={572} y={296} width={156} height={26} rx={10} fillColor={tint} />
      <D.Path i={9} d="M598 296 L590 236 M632 296 L630 232 M666 296 L672 236" w={width * 1.4} />
      <D.Path i={10} d="M600 322 q 6 46 34 50 q 26 4 30 -50" w={width * 0.7} />
      {/* refletor */}
      <D.Path i={11} d="M120 538 L120 92 Q120 76 136 76 L330 76 L330 112" />
      <D.Ellipse i={12} cx={330} cy={138} rx={58} ry={22} fillColor={tint} />
      <D.Path i={13} d="M100 538 L150 538" />
      {/* cuspideira */}
      <D.Path i={14} d="M196 538 L196 430 Q196 410 216 410 L246 410" />
      <D.Ellipse i={15} cx={262} cy={404} rx={26} ry={10} fillColor={tint} />
    </DrawGroup>
    {/* lâmpada acesa */}
    <ellipse cx={330} cy={148} rx={44} ry={10} fill="#FFF6D8" opacity={lamp} />
  </Svg>
);

export const Ultrasound: React.FC<Props> = ({ start, dur, color = C.line, tint = "#EAF4FD", width = 4, style }) => (
  <Svg style={style}>
    <DrawGroup start={start} dur={dur} count={12} color={color} width={width}>
      <D.Rect i={0} x={150} y={250} width={350} height={210} rx={32} fillColor={tint} />
      <D.Rect i={1} x={186} y={290} width={170} height={92} rx={12} fillColor="#FFFFFF" />
      <D.Path i={2} d="M206 352 L236 352 L250 318 L268 372 L284 338 L336 338" w={width * 0.8} />
      <D.Circle i={3} cx={432} cy={336} r={40} fillColor="#FFFFFF" />
      <D.Path i={4} d="M432 336 L452 312" w={width * 1.2} />
      <D.Circle i={5} cx={206} cy={420} r={7} />
      <D.Circle i={6} cx={240} cy={420} r={7} />
      <D.Circle i={7} cx={274} cy={420} r={7} />
      <D.Path i={8} d="M180 460 L180 478 M470 460 L470 478" w={width * 1.6} />
      {/* suporte da caneta e cabo */}
      <D.Rect i={9} x={500} y={286} width={30} height={70} rx={10} fillColor={tint} />
      <D.Path i={10} d="M515 356 C 560 470, 690 440, 660 300 C 650 250, 640 220, 628 196" />
      <D.Rect i={11} transform="translate(628 196) rotate(-62)" x={0} y={-14} width={150} height={28} rx={14} fillColor={tint} />
    </DrawGroup>
    <DrawGroup start={start + dur * 0.75} dur={dur * 0.3} count={2} color={color} width={width}>
      {/* ponta */}
      <D.Path i={0} d="M698 63 L708 44 Q716 30 732 34" w={width * 0.9} />
      <D.Path i={1} d="M650 154 L664 128 M660 160 L674 134 M670 166 L684 140" w={width * 0.6} />
    </DrawGroup>
  </Svg>
);

export const VacuumPump: React.FC<Props> = ({ start, dur, color = C.line, tint = "#EAF4FD", width = 4, style }) => (
  <Svg style={style}>
    <DrawGroup start={start} dur={dur} count={12} color={color} width={width}>
      <D.Rect i={0} x={140} y={470} width={520} height={22} rx={8} fillColor={tint} />
      <D.Rect i={1} x={170} y={316} width={250} height={154} rx={34} fillColor={tint} />
      <D.Path i={2} d="M206 340 L206 446 M236 340 L236 446 M266 340 L266 446 M296 340 L296 446 M326 340 L326 446 M356 340 L356 446 M386 340 L386 446" w={width * 0.7} />
      <D.Rect i={3} x={420} y={286} width={210} height={184} rx={24} fillColor={tint} />
      <D.Circle i={4} cx={525} cy={378} r={62} fillColor="#FFFFFF" />
      <D.Circle i={5} cx={525} cy={378} r={20} />
      <D.Path i={6} d="M525 316 L525 336 M525 420 L525 440 M463 378 L483 378 M567 378 L587 378" w={width * 0.7} />
      <D.Path i={7} d="M580 286 L580 236 Q580 214 602 214 L690 214" />
      <D.Path i={8} d="M470 286 L470 246 Q470 226 450 226 L380 226" />
      <D.Rect i={9} x={680} y={202} width={20} height={24} rx={4} fillColor={tint} />
      <D.Path i={10} d="M188 492 L188 512 M612 492 L612 512" w={width * 1.6} />
      <D.Path i={11} d="M170 400 C 120 400, 120 470, 90 500" />
    </DrawGroup>
  </Svg>
);

export const CuringLight: React.FC<Props & { glow?: number }> = ({ start, dur, color = C.line, tint = "#EAF4FD", width = 4, style, glow = 0 }) => (
  <Svg style={style}>
    <defs>
      <radialGradient id="cureGlow">
        <stop offset="0" stopColor="#5BB8FF" stopOpacity={0.9} />
        <stop offset="0.4" stopColor="#3D7BFF" stopOpacity={0.35} />
        <stop offset="1" stopColor="#3D7BFF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={612} cy={188} r={120} fill="url(#cureGlow)" opacity={glow} />
    <DrawGroup start={start} dur={dur} count={9} color={color} width={width}>
      {/* base carregadora */}
      <D.Rect i={0} x={150} y={470} width={260} height={54} rx={22} fillColor={tint} />
      <D.Path i={1} d="M186 470 L186 452 Q186 440 198 440 L250 440" />
      {/* corpo */}
      <D.Rect i={2} transform="translate(210 430) rotate(-28)" x={0} y={-30} width={360} height={60} rx={30} fillColor={tint} />
      <D.Rect i={3} transform="translate(210 430) rotate(-28)" x={128} y={-40} width={52} height={12} rx={6} fillColor="#FFFFFF" />
      <D.Path i={4} d="M233 452 L318 407" w={width * 0.6} />
      {/* ponteira de fibra */}
      <D.Path i={5} d="M524 255 L566 233 Q594 218 600 194 L604 178" />
      <D.Path i={6} d="M534 274 L576 252 Q612 234 620 200 L624 184" />
      <D.Path i={7} d="M604 178 L624 184" w={width * 1.4} />
      <D.Circle i={8} cx={612} cy={186} r={6} />
    </DrawGroup>
  </Svg>
);

export const Tools: React.FC<Props> = ({ start, dur, color = C.line, tint = "#EAF4FD", width = 4, style }) => (
  <Svg style={style}>
    <DrawGroup start={start} dur={dur} count={6} color={color} width={width}>
      <g transform="translate(400 300) rotate(42) scale(1.4) translate(0 -129)">
        <D.Path
          i={0}
          d="M16 -48 L16 -18 L-16 -18 L-16 -48 A50.6 50.6 0 0 0 -18 46.6 L-18 290 Q-18 308 0 308 Q18 308 18 290 L18 46.6 A50.6 50.6 0 0 0 16 -48 Z"
          fillColor={tint}
        />
        <D.Circle i={1} cx={0} cy={272} r={8} />
      </g>
      <g transform="translate(400 300) rotate(-42) scale(1.4) translate(0 -150)">
        <D.Rect i={2} x={-28} y={0} width={56} height={134} rx={24} fillColor={tint} />
        <D.Path i={3} d="M-10 22 L-10 112 M10 22 L10 112" w={width * 0.7} />
        <D.Rect i={4} x={-7} y={134} width={14} height={150} rx={4} fillColor={tint} />
        <D.Path i={5} d="M-7 284 L0 306 L7 284" />
      </g>
    </DrawGroup>
  </Svg>
);

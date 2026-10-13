import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const F_DISPLAY = "Inter Tight";
export const F_TEXT = "Inter";
export const F_SERIF = "Instrument Serif";

for (const w of ["500", "600"]) {
  loadFont({ family: F_DISPLAY, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["400", "500", "600"]) {
  loadFont({ family: F_TEXT, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w });
}
loadFont({ family: F_SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });

export const K = {
  bg: "#F6F6F4",
  card: "#FFFFFF",
  ink: "#111315",
  muted: "#6B7078",
  faint: "#A3A7AD",
  line: "#E7E7E4",
  blue: "#0A8EEA",
  blueSoft: "#E8F3FD",
  green: "#1DAA61",
  greenSoft: "#E3F6EA",
  amber: "#C98A06",
  amberSoft: "#FBF1DA",
  chatBg: "#F2EEE8",
  bubbleOut: "#DCF6D4",
};

export const BEAT = 15; // 120 BPM a 30 fps

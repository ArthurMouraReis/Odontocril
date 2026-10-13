import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes locais (SIL Open Font License) — renderização sem depender de rede
export const FONT_TITLE = "Montserrat";
export const FONT_BODY = "Open Sans";

for (const w of ["500", "600", "700", "800"]) {
  loadFont({ family: FONT_TITLE, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["400", "500", "600"]) {
  loadFont({ family: FONT_BODY, url: staticFile(`fonts/open-sans-latin-${w}-normal.woff2`), weight: w });
}

// Cores extraídas da logo oficial
export const C = {
  blue: "#0A8EEA",
  blueDeep: "#075FA8",
  navy: "#062B4A",
  navyDark: "#041B30",
  red: "#CC0808",
  ink: "#0E1A26",
  inkSoft: "#4A5B6C",
  paper: "#F7FAFD",
  mist: "#E6F0F9",
  line: "#0A8EEA",
};

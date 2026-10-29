// Fotos (AR): conecta o painel e os dois modos, sem câmera (demo) e com câmera (MindAR).
import { $ } from "../shared/dom.js";
import { initPageNav } from "../shared/page-nav.js";
import { initCard } from "../shared/card.js";
import { setHash, onHashChange } from "../shared/hash.js";
import { initI18n, onLangChange } from "../shared/i18n.js";
import { STRINGS } from "../shared/strings.js";
import { TARGETS } from "./targets.js";
import { createPanel } from "./panel.js";
import { createDemoView } from "./demo-view.js";
import { createCameraView } from "./camera-view.js";

initI18n(STRINGS, $("lang"));

let current = 0, mode = "demo";
const panel = createPanel(TARGETS, { select });
const views = {
  demo: createDemoView($("demo"), TARGETS),
  ar: createCameraView($("ar"), TARGETS, {
    found: i => { current = i; panel.show(i); panel.message(""); },
    lost: () => panel.waiting(),
  }),
};

function select(i) {
  current = i;
  views.demo.show(i); panel.show(i);
  setHash("foto-" + (i + 1));
}
async function startCamera() {
  panel.message("camOpening");
  try {
    await views.ar.start();
    panel.message("");
    panel.waiting();
  } catch (e) {
    console.error(e);
    panel.message("camError", true);
    setMode("demo");
  }
}
function setMode(m) {
  if (m === mode) return;
  views[mode].stop();
  mode = m;
  $("mode-demo").setAttribute("aria-pressed", m === "demo"); $("mode-ar").setAttribute("aria-pressed", m === "ar");
  panel.setTabsHidden(m === "ar");
  if (m === "ar") { startCamera(); setHash("camera"); }
  else { select(current); views.demo.start(); }
}
// #foto-1 a #foto-N ou #camera, vindos de um link direto
function route(h) {
  const m = /^#foto-(\d+)$/.exec(h);
  if (h === "#camera") setMode("ar");
  else if (m && +m[1] >= 1 && +m[1] <= TARGETS.length) { setMode("demo"); select(+m[1] - 1); }
}
$("mode-demo").addEventListener("click", () => setMode("demo"));
$("mode-ar").addEventListener("click", () => setMode("ar"));
window.addEventListener("keydown", e => {
  if (mode !== "demo") return;
  if (e.key === "ArrowRight") select((current + 1) % TARGETS.length);
  if (e.key === "ArrowLeft") select((current + TARGETS.length - 1) % TARGETS.length);
});
initPageNav($("pages"), $("menu-open"));
onHashChange(route);
// a altura nova do painel reenquadra via initCard
onLangChange(() => { panel.refresh(); views.demo.relabel(); views.ar.relabel(); });
initCard($("card"), $("card-head"), $("card-toggle"), () => views.demo.resize());

const startHash = location.hash; // select(0) troca o hash, então guarda o do link antes
select(0);
views.demo.resize();
views.demo.start();
route(startHash);

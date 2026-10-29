// Tour 3D: monta a cena e conecta passos, painel, câmera, fluxos e rótulos.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { $ } from "../shared/dom.js";
import { initPageNav, initPopover } from "../shared/page-nav.js";
import { initCard } from "../shared/card.js";
import { setHash, onHashChange } from "../shared/hash.js";
import { initI18n, onLangChange } from "../shared/i18n.js";
import { STRINGS } from "../shared/strings.js";
import { GROUND } from "../shared/palette.js";
import { STEPS } from "./steps.js";
import { buildBuilding } from "./building.js";
import { buildFlows } from "./flows.js";
import { createLabels } from "./labels.js";
import { createRig } from "./camera-rig.js";
import { createPanel } from "./panel.js";

initI18n(STRINGS, $("lang"));

// ---------- Cena ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(GROUND);
$("stage").appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(GROUND, 30, 60);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minDistance = 3; controls.maxDistance = 40;

scene.add(new THREE.HemisphereLight(0xcfe3ea, GROUND, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(8, 16, 10);
scene.add(sun);

const building = buildBuilding(scene);
const flows = buildFlows(scene);
const labels = createLabels($("labels"), camera);
const rig = createRig(camera, controls, { reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
rig.place(STEPS[0].cam, STEPS[0].target);

// ---------- Tour ----------
let step = 0, mode = "steps";
const panel = createPanel(STEPS, { go });
const hashKey = () => (mode === "all" ? "ciclo" : "passo-" + step);
const applyFlows = () => flows.setActive(mode === "all" ? flows.names : STEPS[step].flows);

function go(i) {
  step = Math.max(0, Math.min(STEPS.length - 1, i));
  const s = STEPS[step];
  panel.render(step);
  applyFlows(); rig.flyTo(s.cam, s.target);
  setHash(hashKey());
}
function setMode(m) {
  mode = m;
  $("mode-steps").setAttribute("aria-pressed", m === "steps"); $("mode-all").setAttribute("aria-pressed", m === "all");
  if (m === "all") rig.flyTo(STEPS[0].cam, STEPS[0].target);
  applyFlows();
  setHash(hashKey());
}
// #passo-0 a #passo-N ou #ciclo, vindos de um link direto
function route(h) {
  const m = /^#passo-(\d+)$/.exec(h);
  if (h === "#ciclo") setMode("all");
  else if (m && +m[1] < STEPS.length) { setMode("steps"); go(+m[1]); }
}
$("mode-steps").addEventListener("click", () => setMode("steps"));
$("mode-all").addEventListener("click", () => setMode("all"));
window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") go(step + 1);
  if (e.key === "ArrowLeft") go(step - 1);
});
initPageNav($("pages"), $("menu-open"));
onHashChange(route);
initPopover($("legend"), $("legend-btn"));
onLangChange(() => { panel.refresh(); labels.relabel(); }); // a altura nova do painel reenquadra via initCard

// ---------- Loop ----------
const clock = new THREE.Clock();
let t = 0;
function frame() {
  const raw = clock.getDelta(), dt = Math.min(raw, 0.05); t += dt;
  const all = mode === "all", s = STEPS[step];
  rig.tick(raw);
  building.update(dt, { roof: all || s.roof, ceil: all || s.ceil !== false });
  flows.update(t, dt);
  controls.update();
  renderer.render(scene, camera);
  labels.update(all ? labels.keys : s.labels);
  requestAnimationFrame(frame);
}
function resize() {
  rig.fit();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);
initCard($("card"), $("card-head"), $("card-toggle"), resize);
const startHash = location.hash; // go(0) troca o hash, então guarda o do link antes
resize();
go(0);
route(startHash);
$("loading").hidden = true;
frame();

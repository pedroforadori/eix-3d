// Modo sem câmera: a foto em 3D com os fluxos saindo dela.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GROUND } from "../shared/palette.js";
import { buildOverlay } from "./overlay.js";

// Mesma interface do modo câmera (start/stop), mais show(i) para trocar a foto e resize().
export function createDemoView(el, targets) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(GROUND);
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  controls.minAzimuthAngle = -0.9; controls.maxAzimuthAngle = 0.9;
  controls.minPolarAngle = 0.6; controls.maxPolarAngle = 2.2;
  controls.minDistance = 0.6; controls.maxDistance = 4;

  const loader = new THREE.TextureLoader();
  const overlays = [];
  const groups = targets.map(t => {
    const g = new THREE.Group();
    const tex = loader.load(t.file); tex.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, t.h / t.w), new THREE.MeshBasicMaterial({ map: tex }));
    g.add(plane);
    const ov = buildOverlay(t); g.add(ov); overlays.push(ov);
    g.visible = false; scene.add(g); return g;
  });

  let current = 0, userMoved = false, running = false;
  controls.addEventListener("start", () => { userMoved = true; });
  function frame() {
    const t = targets[current], aspect = window.innerWidth / window.innerHeight;
    const hImg = t.h / t.w;
    // distância para a foto caber acima do painel
    const fit = Math.max(hImg / 0.62, 1 / (0.92 * aspect));
    const dist = (fit / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, -0.05, dist); controls.target.set(0, 0, 0); userMoved = false;
  }
  function show(i) {
    current = i; groups.forEach((g, k) => { g.visible = k === i; });
    frame();
  }
  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    const card = document.querySelector(".card");
    const shift = card ? card.getBoundingClientRect().height * 0.5 : 0;
    camera.setViewOffset(window.innerWidth, window.innerHeight, 0, shift, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    frame();
  }
  window.addEventListener("resize", resize);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  function loop() {
    if (!running) return;
    const time = clock.getElapsedTime();
    overlays[current].userData.update(time);
    // leve balanço para mostrar que os fluxos saem da foto
    if (!userMoved && !reduce) {
      const d = camera.position.length();
      const yaw = Math.sin(time * 0.35) * 0.32;
      camera.position.set(Math.sin(yaw) * d, -0.05, Math.cos(yaw) * d);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  function start() {
    el.hidden = false;
    if (!running) { running = true; loop(); }
  }
  function stop() { running = false; el.hidden = true; }
  return { start, stop, show, resize };
}

// Câmera do tour: voo suave entre os passos e enquadramento para tela de celular.
import * as THREE from "three";
import { freeArea } from "../shared/dom.js";

// celular em pé: afasta a câmera para caber a cena
const portrait = camera => camera.aspect < 0.8;
const pullBack = (cam, target) => cam.map((c, i) => target[i] + (c - target[i]) * 1.25);

export function createRig(camera, controls, { reduce }) {
  let tween = null;
  controls.addEventListener("start", () => { tween = null; }); // o usuário assumiu a câmera

  function place(cam, target) {
    if (portrait(camera)) cam = pullBack(cam, target);
    camera.position.set(...cam); controls.target.set(...target);
  }
  function flyTo(cam, target) {
    if (reduce) return place(cam, target);
    if (portrait(camera)) cam = pullBack(cam, target);
    tween = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(...cam), t1: new THREE.Vector3(...target) };
  }
  function tick(raw) {
    if (!tween) return;
    tween.t = Math.min(1, tween.t + Math.min(raw, 0.25) / 1.3);
    const e = tween.t < 0.5 ? 4 * tween.t ** 3 : 1 - (-2 * tween.t + 2) ** 3 / 2;
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (tween.t >= 1) tween = null;
  }
  // centraliza a cena na faixa livre entre o topo e o painel do passo
  function fit() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = portrait(camera) ? 62 : 45;
    camera.setViewOffset(window.innerWidth, window.innerHeight, 0, freeArea().shift, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
  }
  return { place, flyTo, tick, fit };
}

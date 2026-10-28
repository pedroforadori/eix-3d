// Rótulos em HTML presos a pontos da cena.
import * as THREE from "three";
import { FLOOR, ROOF } from "./building.js";

const LABELS = {
  chiller: ["Chiller", [0.1, ROOF + 3.6, 0]],
  crah: ["CRAH", [-7.4, FLOOR + 2.9, 1.2]],
  cold: ["Corredor frio", [3, FLOOR + 2.5, 0]],
  hot: ["Corredor quente", [3, FLOOR + 2.7, 2.6]],
  floor: ["Piso elevado", [-5.6, 0.2, 3.5]],
};

// update(chaves) mostra só esses rótulos e reposiciona todos pela câmera.
export function createLabels(layer, camera) {
  const els = {};
  for (const [k, [txt]] of Object.entries(LABELS)) {
    const el = document.createElement("div"); el.className = "tag"; el.textContent = txt; el.style.opacity = 0;
    layer.appendChild(el); els[k] = el;
  }
  const v = new THREE.Vector3();
  function update(active) {
    for (const [k, [, p]] of Object.entries(LABELS)) {
      const el = els[k];
      v.set(...p).project(camera);
      const on = active.includes(k) && v.z < 1;
      el.style.opacity = on ? 1 : 0;
      el.style.left = ((v.x + 1) / 2) * window.innerWidth + "px";
      el.style.top = ((1 - v.y) / 2) * window.innerHeight + "px";
    }
  }
  return { keys: Object.keys(LABELS), update };
}

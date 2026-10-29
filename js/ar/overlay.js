// Fluxos desenhados em cima de uma foto. A foto tem 1 de largura, centrada na origem.
import * as THREE from "three";
import { makeSprite, makePath, makeSeeds, particleGeometry, trailLine, writeParticles, arrowMarkers } from "../shared/particles.js";
import { FLOW_COLORS, FLOW_LABELS } from "../shared/palette.js";
import { tr } from "../shared/i18n.js";

export const POINT_SIZE = 0.022;
const SPEED = 0.16; // larguras da foto por segundo
const LABEL_H = 0.042; // altura das etiquetas, em larguras da foto
const sprite = makeSprite(0.4, 0.8);

// Etiqueta "Ar quente ≈ 35 °C": caixa escura com faixa na cor do fluxo, como os rótulos do tour.
function drawLabel(canvas, text, color) {
  const g = canvas.getContext("2d"), h = 64, font = '600 38px "Barlow Condensed", "Arial Narrow", sans-serif';
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 44;
  canvas.width = w; canvas.height = h; // redimensionar limpa o canvas
  g.font = font; g.textBaseline = "middle";
  g.fillStyle = "rgba(11, 20, 24, .86)"; g.beginPath(); g.roundRect(1, 1, w - 2, h - 2, 10); g.fill();
  g.strokeStyle = "rgba(228, 236, 238, .25)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = color; g.fillRect(10, 14, 6, h - 28);
  g.fillStyle = "#e4ecee"; g.fillText(text, 28, h / 2 + 1);
  return w / h;
}

// Grupo com trilhas, partículas, setas e etiquetas. userData.update(tempo) anima, userData.points dá acesso
// ao material dos pontos, userData.relabel() redesenha as etiquetas no idioma atual.
export function buildOverlay(t) {
  const group = new THREE.Group();
  const paths = [];
  const toLocal = ([px, py, z]) => new THREE.Vector3(px / t.w - 0.5, (t.h / 2 - py) / t.w, z);
  t.flows((pts, c0, c1, range = [0.45, 0.55]) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(toLocal), false, "centripetal");
    const p = makePath(curve, c0, c1, range, { samples: 160, perUnit: 34, minCount: 8 });
    paths.push(p);
    group.add(trailLine(p, 0.35));
  });
  const seeds = makeSeeds(paths);
  const geo = particleGeometry(seeds.length);
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: POINT_SIZE, map: sprite, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true,
  }));
  points.frustumCulled = false;
  group.add(points);
  const arrows = arrowMarkers(paths, { every: 3, spacing: 0.3, size: 0.03, flat: true });
  group.add(arrows.mesh);

  // etiquetas: [px, py, z, fluxo, valor]
  const labels = (t.labels || []).map(([px, py, z, key, value]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false }));
    s.center.set(0.5, 0); s.position.copy(toLocal([px, py, z])); s.renderOrder = 20;
    group.add(s);
    return { s, key, value };
  });
  // a largura do texto muda com o idioma e a fonte, e a textura não pode mudar de tamanho depois de enviada
  // à GPU: por isso cada redesenho cria um canvas e uma textura novos
  function relabel() {
    for (const l of labels) {
      const canvas = document.createElement("canvas");
      const aspect = drawLabel(canvas, `${tr(FLOW_LABELS[l.key][0])} ${l.value}`, FLOW_COLORS[l.key].getStyle());
      const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
      l.s.material.map?.dispose(); l.s.material.map = tex; l.s.material.needsUpdate = true;
      l.s.scale.set(LABEL_H * aspect, LABEL_H, 1);
    }
  }
  relabel();
  document.fonts?.ready.then(relabel); // redesenha quando a Barlow Condensed terminar de carregar

  group.userData.points = points;
  group.userData.relabel = relabel;
  group.userData.update = time => {
    writeParticles(seeds, geo, time * SPEED, { edge: 6, floor: 0.25 });
    arrows.update(time * SPEED);
  };
  return group;
}

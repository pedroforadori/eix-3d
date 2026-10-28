// Fluxos: partículas correndo por curvas. Usado pelo tour 3D e pelas fotos.
import * as THREE from "three";

export const rnd = (a, b) => a + Math.random() * (b - a);

// Ponto redondo com borda suave; mid/alpha controlam o quanto o miolo é cheio.
export function makeSprite(mid, alpha) {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(mid, `rgba(255,255,255,${alpha})`); r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}

// Caminho: curva amostrada em pontos igualmente espaçados (lut), cor inicial, cor final e faixa [a, b] da transição.
// count = partículas no caminho, proporcional ao comprimento.
export function makePath(curve, c0, c1, range, { samples, perUnit, minCount }) {
  const len = curve.getLength(), lut = curve.getSpacedPoints(samples);
  return { curve, len, lut, c0, c1, range, count: Math.max(minCount, Math.round(len * perUnit)) };
}

// Partículas distribuídas por igual em cada caminho; jitter (em frações do espaçamento) quebra o alinhamento.
export function makeSeeds(paths, jitter = 0) {
  const seeds = [];
  for (const p of paths) for (let k = 0; k < p.count; k++) seeds.push({ p, off: k / p.count + (jitter ? rnd(0, jitter / p.count) : 0) });
  return seeds;
}

export function particleGeometry(n) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  return geo;
}

// trilha tênue por baixo das partículas
export function trailLine(p, opacity) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(p.lut),
    new THREE.LineBasicMaterial({ color: p.c0.clone().lerp(p.c1, 0.5), transparent: true, opacity, depthWrite: false }));
}

// Avança as partículas: travel = distância percorrida (tempo × velocidade).
// Nas pontas o brilho cai de 1 até floor; edge define o quão curta é essa rampa.
const tmp = new THREE.Color();
export function writeParticles(seeds, geo, travel, { edge, floor }) {
  const pos = geo.attributes.position.array, col = geo.attributes.color.array;
  seeds.forEach((s, i) => {
    const p = s.p, u = (s.off + travel / p.len) % 1;
    const f = u * (p.lut.length - 1), i0 = Math.floor(f), a = p.lut[i0], b = p.lut[Math.min(i0 + 1, p.lut.length - 1)], w = f - i0;
    pos[i * 3] = a.x + (b.x - a.x) * w; pos[i * 3 + 1] = a.y + (b.y - a.y) * w; pos[i * 3 + 2] = a.z + (b.z - a.z) * w;
    const k = THREE.MathUtils.clamp((u - p.range[0]) / (p.range[1] - p.range[0]), 0, 1);
    const fade = Math.min(1, u * edge, (1 - u) * edge); // nasce e some suavemente
    tmp.copy(p.c0).lerp(p.c1, k).multiplyScalar(floor + (1 - floor) * fade);
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
  });
  geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
}

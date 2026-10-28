// Os 5 fluxos do tour, cada um um grupo de partículas que acende ou apaga junto.
import * as THREE from "three";
import { FLOW_COLORS as C } from "../shared/palette.js";
import { rnd, makeSprite, makePath, makeSeeds, particleGeometry, trailLine, writeParticles } from "../shared/particles.js";
import { FLOOR, CEIL, ROOF, mat } from "./building.js";

// Monta os fluxos na cena. setActive(nomes) acende esses e apaga os outros; update(t, dt) anima.
export function buildFlows(scene) {
  const groups = {};
  function flowGroup(name, { size = 0.16, speed = 1.6, perUnit = 3.2 } = {}) {
    groups[name] = { name, paths: [], size: size * 1.7, speed, perUnit: perUnit * 1.6, opacity: 1, target: 1 };
    return groups[name];
  }
  // path: pontos, cor inicial, cor final, faixa da transição [a, b]
  function addPath(group, pts, c0, c1, range = [0.4, 0.6]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, "centripetal");
    group.paths.push(makePath(curve, c0, c1, range, { samples: 240, perUnit: group.perUnit, minCount: 6 }));
  }

  // 1) Ar da rua entrando pelas serpentinas e saindo quente pelos ventiladores
  const gOut = flowGroup("outside", { perUnit: 2.4 });
  for (const cx of [-3, 3.2]) for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const dx = -1.875 + i * 1.25 + rnd(-0.25, 0.25), y0 = ROOF + rnd(0.9, 2.0);
    addPath(gOut, [[cx + dx, y0, s * 4], [cx + dx, ROOF + 1.7, s * 1.25], [cx + dx, ROOF + 2.0, s * 0.35],
      [cx + dx + rnd(-0.1, 0.1), ROOF + 2.9, 0], [cx + dx + rnd(-0.4, 0.4), ROOF + 5.6, rnd(-0.4, 0.4)]], C.outside, C.hot, [0.42, 0.62]);
  }

  // 2) Água gelada (ida) e de retorno entre chillers e CRAH
  const gWater = flowGroup("water", { size: 0.14, speed: 1.4, perUnit: 2.6 });
  const pipeY = ROOF + 0.55;
  for (const cx of [-3, 3.2]) {
    const sup = [[cx - 2.5, pipeY, -0.7], [cx - 2.6, pipeY, -1.4], [-7.6, pipeY, -1.4], [-7.6, CEIL + 0.3, -1.4], [-7.6, FLOOR + 2.7, -1.4]];
    const ret = [[-7.2, FLOOR + 2.7, -1.75], [-7.2, CEIL + 0.3, -1.75], [-7.2, pipeY + 0.25, -1.75], [cx - 2.4, pipeY + 0.25, -1.75], [cx - 2.4, pipeY + 0.25, -0.9]];
    addPath(gWater, sup, C.water, C.water);
    addPath(gWater, ret, C.ret, C.ret);
    for (const [pts, col] of [[sup, 0x2a63c4], [ret, 0xc23a2e]]) {
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.05);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.07, 10), mat(col, { metalness: 0.5, roughness: 0.4 }));
      scene.add(tube);
    }
  }

  // 3) Ar frio: CRAH -> vão do piso -> placas perfuradas -> corredor frio
  const gFloor = flowGroup("floor", { perUnit: 2.6 });
  for (let i = 0; i < 14; i++) {
    const xt = -4.2 + (i / 13) * 9.6, zt = rnd(-0.4, 0.4), zs = rnd(-1.3, 1.3);
    addPath(gFloor, [[-6.85, FLOOR + rnd(0.6, 1.8), zs], [-7.0, 0.3, zs], [-5.8, 0.25, zs * 0.6], [xt - 0.6, 0.28, zt],
      [xt, FLOOR + 0.05, zt], [xt + rnd(-0.1, 0.1), FLOOR + rnd(1.2, 2.0), zt * 0.6]], C.cold, C.cold);
  }

  // 4) Pelos racks: frente (corredor frio) -> trás (corredor quente)
  const gRacks = flowGroup("racks", { perUnit: 3.4, speed: 1.1 });
  for (const s of [-1, 1]) for (let i = 0; i < 10; i++) {
    const x = -4.5 + i * 1.0 + rnd(-0.2, 0.2), y = FLOOR + rnd(0.5, 2.0);
    addPath(gRacks, [[x, y - 0.3, s * 0.15], [x, y, s * 0.7], [x, y, s * 1.3], [x, y + 0.05, s * 1.9], [x, y + 0.6, s * 2.6]], C.cold, C.hot, [0.35, 0.68]);
  }

  // 5) Retorno quente: corredor quente -> forro -> entreforro -> CRAH
  const gRet = flowGroup("return", { perUnit: 2.2 });
  for (const s of [-1, 1]) for (let i = 0; i < 7; i++) {
    const x = -4.2 + i * 1.5 + rnd(-0.3, 0.3);
    addPath(gRet, [[x, FLOOR + 1.6, s * 2.6], [x, CEIL - 0.2, s * 2.55], [x - 0.4, CEIL + 0.45, s * 2.3],
      [-5.5, CEIL + 0.5, s * rnd(0.6, 1.4)], [-7.3, CEIL + 0.3, s * rnd(0.3, 1.2)], [-7.3, FLOOR + 2.4, s * rnd(0.3, 1.2)]], C.hot, C.hot);
  }

  // Constrói um Points por grupo
  const sprite = makeSprite(0.35, 0.7);
  for (const g of Object.values(groups)) {
    g.seeds = makeSeeds(g.paths, 0.5);
    g.material = new THREE.PointsMaterial({ size: g.size, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    g.points = new THREE.Points(particleGeometry(g.seeds.length), g.material); g.points.frustumCulled = false; g.points.renderOrder = 10; scene.add(g.points);
    g.lines = g.paths.map(p => { const l = trailLine(p, 0.2); scene.add(l); return l; });
  }

  // os apagados ficam bem fracos, para ainda dar contexto
  function setActive(active) {
    for (const g of Object.values(groups)) g.target = active.includes(g.name) ? 1 : 0.07;
  }
  function update(t, dt) {
    for (const g of Object.values(groups)) {
      g.opacity += (g.target - g.opacity) * Math.min(1, dt * 4);
      g.material.opacity = g.opacity;
      for (const l of g.lines) l.material.opacity = 0.2 * g.opacity;
      writeParticles(g.seeds, g.points.geometry, t * g.speed, { edge: 8, floor: 0 });
    }
  }
  return { names: Object.keys(groups), setActive, update };
}

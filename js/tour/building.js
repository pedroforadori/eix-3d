// Prédio em corte: laje, piso elevado (60 cm), sala, forro, entreforro e telhado, com CRAH em corte, racks e chillers.
import * as THREE from "three";

export const FLOOR = 0.6, CEIL = 3.6, ROOF = 4.6;
// CRAH em corte e chiller: medidas compartilhadas com os fluxos (flows.js) para o ar passar nos lugares certos
export const CRAH = {
  x: -7.4,
  coilTop: [-7.85, FLOOR + 2.15], coilBottom: [-6.95, FLOOR + 1.35], // serpentina inclinada (x, y)
  fanZ: [-1.15, 0, 1.15],
  supplyHeader: [[-7.6, FLOOR + 2.7, -1.4], [-7.6, FLOOR + 2.45, -1.82], [-7.85, FLOOR + 2.17, -1.82]],
  returnHeader: [[-6.95, FLOOR + 1.37, -1.82], [-7.2, FLOOR + 2.2, -1.82], [-7.2, FLOOR + 2.7, -1.75]],
};
export const CHILLER = { length: 5, depth: 2.2, bays: 5, fanZ: [-0.52, 0.52] };

export const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1, ...extra });
const glass = (color, opacity) => new THREE.MeshStandardMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, roughness: 0.4 });

// Listras finas em textura (aletas de serpentina, filtro); dir "u" = listras em pé, "v" = deitadas.
function stripes(bg, line, n, dir) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"); g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = line;
  const w = Math.max(1, 96 / n);
  for (let i = 0; i < n; i++) { const p = Math.round((i * 256) / n); if (dir === "u") g.fillRect(p, 0, w, 256); else g.fillRect(0, p, 256, w); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

// Monta o prédio na cena. update(dt, { roof, ceil }) gira os ventiladores e esmaece telhado/forro quando estão ocultos.
export function buildBuilding(scene) {
  function box(w, h, d, material, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z); scene.add(m); return m;
  }

  // ventilador com anel; devolve as pás para girar
  function fan(x, y, z, r, h) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24, 1, true), mat(0x58656a, { side: THREE.DoubleSide }));
    ring.position.set(x, y, z); scene.add(ring);
    const blades = new THREE.Group();
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(r * 1.75, 0.02, r * 0.3), mat(0x2b3438));
      blade.rotation.y = (b * Math.PI) / 4; blade.rotation.x = 0.25; blades.add(blade);
    }
    blades.position.set(x, y, z); scene.add(blades); return blades;
  }

  box(18, 0.2, 11, mat(0x1a2a31), 0, -0.1, 0);
  const roofSlab = box(18, 0.25, 11, glass(0x55707a, 0.18), 0, ROOF + 0.12, 0);
  box(0.15, ROOF, 11, glass(0x55707a, 0.12), -8.5, ROOF / 2, 0);
  box(18, ROOF, 0.15, glass(0x55707a, 0.1), 0, ROOF / 2, -5.5);
  box(16.5, 0.04, 10, glass(0x9fb4bb, 0.22), -0.2, FLOOR, 0);
  const grid = new THREE.GridHelper(16.8, 28, 0x3a5560, 0x2a3f47);
  grid.position.set(-0.2, FLOOR + 0.03, 0); scene.add(grid);
  const ceilMats = [];
  const ceilSlab = box(16.5, 0.04, 10, glass(0x9fb4bb, 0.12), -0.2, CEIL, 0); ceilMats.push([ceilSlab.material, 0.12]);
  // pedestais do piso elevado
  for (let x = -8; x <= 7.6; x += 1.2) for (let z = -4.6; z <= 4.6; z += 1.2) box(0.06, FLOOR, 0.06, mat(0x2d434b), x, FLOOR / 2, z);

  // Placas perfuradas no corredor frio e grelhas de retorno no forro
  const perf = glass(0x4fd2ff, 0.35);
  for (let x = -4.2; x <= 5.4; x += 0.6) box(0.56, 0.05, 1.1, perf, x, FLOOR + 0.03, 0);
  const grille = glass(0xff8a3d, 0.3); ceilMats.push([grille, 0.3]);
  for (const z of [-2.55, 2.55]) for (let x = -4.2; x <= 5.4; x += 1.2) box(1.1, 0.05, 0.56, grille, x, CEIL, z);

  const fans = [];

  // CRAH em corte (ar-condicionado de precisão da sala), como no vídeo de referência: o ar quente entra por cima,
  // passa pelo filtro e pela serpentina inclinada com água gelada, e os ventiladores de baixo sopram o ar frio no piso.
  const CX = CRAH.x, CB = FLOOR;
  const frame = mat(0x5b6a70, { metalness: 0.3 });
  box(0.04, 2.6, 3.8, mat(0x2c383d), CX - 0.58, CB + 1.3, 0); // fundo
  for (const s of [-1, 1]) box(1.2, 2.6, 0.04, glass(0x8aa0a8, 0.28), CX, CB + 1.3, s * 1.88); // laterais
  box(0.03, 2.6, 3.8, glass(0x9fb4bb, 0.07), CX + 0.6, CB + 1.3, 0); // frente de vidro: é o corte
  for (const x of [-0.58, 0.58]) for (const z of [-1.88, 1.88]) box(0.06, 2.6, 0.06, frame, CX + x, CB + 1.3, z);
  for (const y of [0, 2.6]) for (const z of [-1.88, 1.88]) box(1.2, 0.06, 0.06, frame, CX, CB + y, z);
  // filtro na entrada de cima
  box(1.1, 0.08, 3.7, mat(0xffffff, { map: stripes("#d5dde0", "#93a5ab", 40, "v"), roughness: 0.9 }), CX, CB + 2.42, 0);
  // serpentina: aletas de alumínio (listras) com pontas de cobre nas laterais
  const [tx, ty] = CRAH.coilTop, [bx, by] = CRAH.coilBottom;
  const coil = box(Math.hypot(bx - tx, by - ty), 0.14, 3.5, mat(0xffffff, { map: stripes("#c3ced2", "#6c7c83", 90, "v"), metalness: 0.5, roughness: 0.4 }),
    (tx + bx) / 2, (ty + by) / 2, 0);
  coil.rotation.z = Math.atan2(by - ty, bx - tx);
  const copper = mat(0xc27a4a, { metalness: 0.6, roughness: 0.35 });
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) {
    const f = (k + 0.5) / 6, stub = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 10), copper);
    stub.rotation.x = Math.PI / 2; stub.position.set(tx + (bx - tx) * f, ty + (by - ty) * f, s * 1.79); scene.add(stub);
  }
  // coletores: a água gelada chega na ponta de cima da serpentina e sai pela de baixo
  for (const [pts, col] of [[CRAH.supplyHeader, 0x2a63c4], [CRAH.returnHeader, 0xc23a2e]]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(q => new THREE.Vector3(...q)), false, "catmullrom", 0.05);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.05, 8), mat(col, { metalness: 0.5, roughness: 0.4 })));
  }
  // ventiladores embaixo, soprando para dentro do vão do piso
  for (const z of CRAH.fanZ) fans.push(fan(CX, CB + 0.42, z, 0.4, 0.22));
  box(1.2, 1.0, 3.8, glass(0x8aa0a8, 0.25), CX, CEIL + 0.5, 0); // duto de retorno até o entreforro

  // Racks: duas fileiras com as frentes viradas para o corredor frio
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x151b1e, transparent: true, opacity: 0.6, roughness: 0.5, depthWrite: false });
  const ledMat = mat(0x4fd2ff, { emissive: 0x1f8fb0 });
  for (const side of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const x = -4.5 + i * 1.0;
      box(0.92, 2.2, 1.1, rackMat, x, FLOOR + 1.1, side * 1.3);
      for (let k = 0; k < 5; k++) box(0.6, 0.02, 0.01, ledMat, x, FLOOR + 0.4 + k * 0.4, side * 0.745);
    }
    // confinamento do corredor quente
    box(10.6, CEIL - FLOOR, 0.04, glass(0xff8a3d, 0.07), 0.05, (CEIL + FLOOR) / 2, side * 3.2);
    box(0.04, CEIL - FLOOR, 1.35, glass(0xff8a3d, 0.1), 5.4, (CEIL + FLOOR) / 2, side * 2.53);
  }

  // Chillers resfriados a ar no telhado, como o Trane da referência: base com compressores,
  // serpentinas nas laterais (triângulos claros com a ponta para baixo) e 2 fileiras de ventiladores no topo.
  const roofMats = [];
  function chiller(cx) {
    const base = ROOF + 0.25, { length: L, depth: D, bays } = CHILLER, bay = L / bays;
    const start = scene.children.length;
    const white = mat(0xd6dcdf, { roughness: 0.6 }), dark = mat(0x2b3438);
    box(L, 0.12, D, dark, cx, base + 0.06, 0); // base
    for (const x of [-L / 2, L / 2]) for (const z of [-D / 2, D / 2]) box(0.08, 2.44, 0.08, white, cx + x, base + 1.22, z);
    for (const x of [-L / 2, L / 2]) box(0.04, 1.6, D, white, cx + x, base + 1.6, 0); // painéis das pontas
    // compressores e bomba na base
    const steel = mat(0x7d878c, { metalness: 0.45, roughness: 0.5 });
    for (let k = 0; k < 4; k++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 16), steel);
      c.position.set(cx - 1.5 + k * 0.8, base + 0.4, 0); scene.add(c);
    }
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.6, 16), mat(0x3a4448, { metalness: 0.3 }));
    motor.rotation.z = Math.PI / 2; motor.position.set(cx + 1.9, base + 0.35, 0.5); scene.add(motor);
    box(L, 0.05, D, white, cx, base + 0.78, 0);
    // serpentinas: face de aletas recuada e triângulos claros por cima
    const coilFace = mat(0xffffff, { map: stripes("#45535a", "#27323a", 120, "u"), metalness: 0.2 });
    const tri = new THREE.Shape();
    tri.moveTo(-bay / 2, 0.8); tri.lineTo(bay / 2, 0.8); tri.lineTo(0, -0.8); tri.closePath();
    const triGeo = new THREE.ShapeGeometry(tri), triMat = mat(0xe3e8ea, { side: THREE.DoubleSide });
    for (const s of [-1, 1]) {
      box(L, 1.6, 0.04, coilFace, cx, base + 1.6, s * (D / 2 - 0.06));
      for (let b = 0; b < bays; b++) {
        const m = new THREE.Mesh(triGeo, triMat);
        m.position.set(cx - L / 2 + bay * (b + 0.5), base + 1.6, s * D / 2); scene.add(m);
      }
    }
    box(L, 0.08, D, white, cx, base + 2.44, 0); // tampo
    for (let b = 0; b < bays; b++) for (const z of CHILLER.fanZ) fans.push(fan(cx - L / 2 + bay * (b + 0.5), base + 2.6, z, 0.4, 0.24));
    for (const o of scene.children.slice(start)) o.traverse(m => {
      if (m.material && !roofMats.includes(m.material)) { m.material.transparent = true; roofMats.push(m.material); }
    });
  }
  chiller(-3); chiller(3.2);

  let roofOpacity = 1, ceilOpacity = 1;
  function update(dt, show) {
    for (const f of fans) f.rotation.y += dt * 9;
    roofOpacity += ((show.roof ? 1 : 0.06) - roofOpacity) * Math.min(1, dt * 4);
    for (const m of roofMats) { m.opacity = roofOpacity; m.depthWrite = roofOpacity > 0.9; }
    roofSlab.material.opacity = 0.18 * roofOpacity;
    ceilOpacity += ((show.ceil ? 1 : 0.05) - ceilOpacity) * Math.min(1, dt * 4);
    for (const [m, o] of ceilMats) m.opacity = o * ceilOpacity;
  }
  return { update };
}

// Prédio em corte: laje, piso elevado (60 cm), sala, forro, entreforro e telhado, com CRAH, racks e chillers.
import * as THREE from "three";

export const FLOOR = 0.6, CEIL = 3.6, ROOF = 4.6;

export const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1, ...extra });
const glass = (color, opacity) => new THREE.MeshStandardMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, roughness: 0.4 });

// Monta o prédio na cena. update(dt, { roof, ceil }) gira os ventiladores e esmaece telhado/forro quando estão ocultos.
export function buildBuilding(scene) {
  function box(w, h, d, material, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z); scene.add(m); return m;
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

  // CRAH (ar-condicionado de precisão da sala), insuflamento por baixo
  box(1.2, 2.6, 3.8, mat(0x39474d, { roughness: 0.6 }), -7.4, FLOOR + 1.3, 0);
  box(0.02, 0.5, 0.8, mat(0x4fd2ff, { emissive: 0x0b4a5c }), -6.79, FLOOR + 2.1, 0.8);
  box(1.2, 1.0, 3.8, glass(0x8aa0a8, 0.25), -7.4, CEIL + 0.5, 0); // duto de retorno até o entreforro

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

  // Chillers resfriados a ar no telhado
  const roofMats = [], fans = [];
  function chiller(cx) {
    const base = ROOF + 0.25;
    const start = scene.children.length;
    box(5, 0.9, 2.2, mat(0x6f7b80, { metalness: 0.3 }), cx, base + 0.45, 0);
    const coil = mat(0x9aa6ab, { metalness: 0.4, roughness: 0.5 });
    const coilFace = new THREE.MeshStandardMaterial({ color: 0x4a585e, side: THREE.DoubleSide, metalness: 0.2 });
    for (let i = 0; i < 4; i++) {
      const x = cx - 1.875 + i * 1.25;
      for (const s of [-1, 1]) {
        // serpentina em V: duas faces inclinadas
        const p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), coilFace);
        p.position.set(x, base + 1.7, s * 0.85); p.rotation.x = s * 0.35; scene.add(p);
      }
      box(0.05, 1.6, 2.2, coil, x - 0.62, base + 1.7, 0);
      // ventilador
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24, 1, true), mat(0x58656a, { side: THREE.DoubleSide }));
      ring.position.set(x, base + 2.65, 0); scene.add(ring);
      const fan = new THREE.Group();
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.02, 0.16), mat(0x2b3438));
        blade.rotation.y = (b * Math.PI) / 4; blade.rotation.x = 0.25; fan.add(blade);
      }
      fan.position.set(x, base + 2.65, 0); scene.add(fan); fans.push(fan);
    }
    box(5, 0.08, 2.2, mat(0x6f7b80), cx, base + 2.5, 0);
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

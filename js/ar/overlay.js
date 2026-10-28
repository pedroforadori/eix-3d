// Fluxos desenhados em cima de uma foto. A foto tem 1 de largura, centrada na origem.
import * as THREE from "three";
import { makeSprite, makePath, makeSeeds, particleGeometry, trailLine, writeParticles } from "../shared/particles.js";

export const POINT_SIZE = 0.022;
const SPEED = 0.16; // larguras da foto por segundo
const sprite = makeSprite(0.4, 0.8);

// Grupo com as trilhas e as partículas; userData.update(tempo) anima, userData.points dá acesso ao material.
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
  group.userData.points = points;
  group.userData.update = time => writeParticles(seeds, geo, time * SPEED, { edge: 6, floor: 0.25 });
  return group;
}

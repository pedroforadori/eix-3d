// Modo câmera: MindAR rastreia as fotos e desenha os fluxos em cima delas.
import * as THREE from "three";
import { buildOverlay, POINT_SIZE } from "./overlay.js";

const MINDAR = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";

// Mesma interface do modo sem câmera (start/stop). start() é assíncrono e rejeita se a câmera não abrir.
// found(i) avisa que a foto i apareceu; lost() que ela saiu de vista.
export function createCameraView(el, targets, { found, lost }) {
  let mindar = null, overlays = [];
  const wscale = new THREE.Vector3();
  const clock = new THREE.Clock();

  async function start() {
    if (!mindar) {
      const { MindARThree } = await import(MINDAR);
      mindar = new MindARThree({
        container: el, imageTargetSrc: "alvos.mind", maxTrack: 1,
        uiLoading: "no", uiScanning: "no", uiError: "no", filterMinCF: 0.0001, filterBeta: 0.001,
      });
      overlays = targets.map((t, i) => {
        const anchor = mindar.addAnchor(i);
        const ov = buildOverlay(t); anchor.group.add(ov);
        anchor.onTargetFound = () => found(i);
        anchor.onTargetLost = () => lost();
        return ov;
      });
    }
    el.hidden = false;
    await mindar.start();
    mindar.renderer.setAnimationLoop(() => {
      const time = clock.getElapsedTime();
      overlays.forEach(o => {
        // o tamanho dos pontos não acompanha a escala da âncora; corrige aqui
        o.getWorldScale(wscale); o.userData.points.material.size = POINT_SIZE * wscale.x;
        o.userData.update(time);
      });
      mindar.renderer.render(mindar.scene, mindar.camera);
    });
  }
  function stop() {
    if (!mindar) return;
    mindar.renderer.setAnimationLoop(null);
    try { mindar.stop(); } catch (e) { /* já parado */ }
    el.hidden = true;
  }
  return { start, stop };
}

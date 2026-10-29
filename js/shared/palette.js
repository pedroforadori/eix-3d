import * as THREE from "three";
import { STRINGS } from "./strings.js";

// Mesmas cores dos tokens em css/base.css; mude nos dois lugares.
export const GROUND = 0x0b1418;
export const FLOW_COLORS = {
  outside: new THREE.Color(0xc4d0d6), cold: new THREE.Color(0x4fd2ff), hot: new THREE.Color(0xff8a3d),
  water: new THREE.Color(0x3f8cff), ret: new THREE.Color(0xff4d3d), cond: new THREE.Color(0xffc93d),
};
// texto da legenda (PT/EN, em strings.js) e a variável CSS da cor
export const FLOW_LABELS = {
  outside: [STRINGS.flowOutside, "var(--outside)"], cold: [STRINGS.flowCold, "var(--cold)"], hot: [STRINGS.flowHot, "var(--hot)"],
  water: [STRINGS.flowWater, "var(--water)"], ret: [STRINGS.flowRet, "var(--return)"], cond: [STRINGS.flowCond, "var(--cond)"],
};

import * as THREE from "three";

// Mesmas cores dos tokens em css/base.css; mude nos dois lugares.
export const GROUND = 0x0b1418;
export const FLOW_COLORS = {
  outside: new THREE.Color(0xc4d0d6), cold: new THREE.Color(0x4fd2ff), hot: new THREE.Color(0xff8a3d),
  water: new THREE.Color(0x3f8cff), ret: new THREE.Color(0xff4d3d),
};
// texto da legenda e a variável CSS da cor
export const FLOW_LABELS = {
  outside: ["Ar da rua", "var(--outside)"], cold: ["Ar frio", "var(--cold)"], hot: ["Ar quente", "var(--hot)"],
  water: ["Água gelada", "var(--water)"], ret: ["Água de retorno", "var(--return)"],
};

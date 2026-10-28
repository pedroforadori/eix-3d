// As 4 fotos, na mesma ordem do arquivo alvos.mind.
// Coordenadas em pixels da foto original (474 de largura); z = quanto o fluxo sai da foto, em larguras da foto.
// flows(add) desenha os caminhos: add(pontos, cor inicial, cor final, faixa da transição).
import { FLOW_COLORS as COL } from "../shared/palette.js";
import { rnd } from "../shared/particles.js";

export const TARGETS = [
  {
    file: "alvos/1-telhado.jpg", w: 474, h: 316, tab: "Telhado",
    title: "Chillers no telhado",
    text: "Os ventiladores em cima puxam o ar da rua pelas serpentinas em V. O ar leva o calor da água e sai quente para cima. A água gelada desce pela tubulação até a sala.",
    legend: ["outside", "hot", "water", "ret"],
    flows(add) {
      for (let i = 0; i < 12; i++) {
        const x = 95 + i * 19 + rnd(-6, 6), y = rnd(128, 158);
        add([[x - 20, y + 25, 0.3], [x, y, 0.06], [x + 4, y - 25, 0.02], [x + 6, 92, 0.01], [x + rnd(-10, 10), -40, 0.03]], COL.outside, COL.hot, [0.42, 0.62]);
      }
      for (const dx of [0, 6]) {
        add([[290 + dx, 150, 0.01], [315 + dx, 140, 0.02], [322 + dx, 200, 0.02], [328 + dx, 262, 0.02]], COL.water, COL.water);
      }
      add([[340, 262, 0.02], [334, 200, 0.02], [328, 142, 0.02], [300, 158, 0.01]], COL.ret, COL.ret);
    },
  },
  {
    file: "alvos/2-chiller.jpg", w: 474, h: 316, tab: "Chiller",
    title: "Chiller resfriado a ar",
    text: "Cada V da lateral é uma serpentina com a água do data center. O ar da rua passa por ela, esquenta e é jogado para cima pelos ventiladores do topo.",
    legend: ["outside", "hot", "water", "ret"],
    flows(add) {
      for (let i = 0; i < 12; i++) {
        const x = 240 + i * 19 + rnd(-6, 6), y = rnd(140, 192);
        add([[x - 30, y + 30, 0.3], [x, y, 0.05], [x + 3, y - 40, 0.02], [x + 4, 92, 0.01], [x + rnd(-10, 10), -50, 0.03]], COL.outside, COL.hot, [0.42, 0.62]);
      }
      add([[440, 238, 0.02], [380, 240, 0.02], [320, 240, 0.02], [250, 238, 0.02]], COL.water, COL.water);
      add([[250, 252, 0.02], [320, 254, 0.02], [380, 254, 0.02], [440, 252, 0.02]], COL.ret, COL.ret);
    },
  },
  {
    file: "alvos/3-sala.jpg", w: 474, h: 355, tab: "Sala",
    title: "Ar-condicionado da sala (CRAH)",
    text: "O CRAH sopra o ar frio por baixo do piso elevado. O ar sobe pelas placas perfuradas, entra pela frente dos racks e o ar quente volta por cima até o CRAH.",
    legend: ["cold", "hot"],
    flows(add) {
      for (let i = 0; i < 12; i++) {
        const x = 185 + i * 14 + rnd(-5, 5);
        add([[265, 262, 0], [265 + (x - 265) * 0.4, 290, 0.03], [x, 335, 0.1], [x, 300, 0.2], [x + rnd(-8, 8), 210, 0.26]], COL.cold, COL.cold);
      }
      for (const s of [-1, 1]) for (let i = 0; i < 7; i++) {
        const y = rnd(170, 255), x0 = 265 + s * rnd(10, 40);
        add([[x0, y + 40, 0.2], [265 + s * 70, y, 0.12], [265 + s * 120, y - 5, 0.06], [265 + s * 175, y - 10, 0.03]], COL.cold, COL.hot, [0.7, 0.95]);
      }
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
        const x0 = 265 + s * rnd(150, 230);
        add([[x0, rnd(60, 120), 0.04], [265 + s * 120, 70, 0.06], [265 + s * 50, 125, 0.04], [265 + s * 10, 145, 0.01]], COL.hot, COL.hot);
      }
    },
  },
  {
    file: "alvos/4-corredor-quente.jpg", w: 474, h: 631, tab: "Corredor quente",
    title: "Corredor quente fechado",
    text: "O ar sai quente pela parte de trás dos servidores, fica preso no corredor fechado e sobe pelas grelhas do forro, de volta ao ar-condicionado da sala.",
    legend: ["hot"],
    flows(add) {
      for (let i = 0; i < 16; i++) {
        const y = rnd(300, 580), x = rnd(110, 200), xt = rnd(230, 400);
        add([[x, y, 0.02], [x + 90, y - 30, 0.08], [rnd(280, 380), (y + 120) / 2, 0.1], [xt, 110, 0.05], [xt + rnd(-10, 10), 10, 0.02]], COL.hot, COL.hot);
      }
    },
  },
];

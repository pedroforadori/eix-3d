// As 6 fotos, na mesma ordem do arquivo alvos.mind.
// Coordenadas em pixels da foto original (474 de largura); z = quanto o fluxo sai da foto, em larguras da foto.
// labels: etiquetas [px, py, z, fluxo, valor] presas à foto. tab/title/text vêm em PT e EN. flows(add) desenha os caminhos: add(pontos, cor inicial, cor final, faixa da transição).
import { FLOW_COLORS as COL } from "../shared/palette.js";
import { rnd } from "../shared/particles.js";

export const TARGETS = [
  {
    file: "alvos/1-telhado.jpg", w: 474, h: 316, tab: { pt: "Telhado", en: "Roof" },
    title: { pt: "Chillers no telhado", en: "Chillers on the roof" },
    text: {
      pt: "Os ventiladores em cima puxam o ar da rua pelas serpentinas em V. O ar leva o calor da água e sai quente para cima. A água gelada desce pela tubulação até a sala.",
      en: "The fans on top pull outside air through the V-shaped coils. The air takes the heat from the water and leaves hot, upward. Chilled water runs down the pipes to the room.",
    },
    labels: [[200, 40, 0.03, "hot", "≈ 40 °C"], [70, 182, 0.05, "outside", "≈ 30 °C"], [372, 210, 0.02, "water", "≈ 7 °C"]],
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
    file: "alvos/2-chiller.jpg", w: 474, h: 316, tab: { pt: "Chiller", en: "Chiller" },
    title: { pt: "Chiller resfriado a ar", en: "Air-cooled chiller" },
    text: {
      pt: "Cada V da lateral é uma serpentina com a água do data center. O ar da rua passa por ela, esquenta e é jogado para cima pelos ventiladores do topo.",
      en: "Each V on the side is a coil carrying the data center's water. Outside air passes through it, heats up and is blown upward by the fans on top.",
    },
    labels: [[330, 45, 0.03, "hot", "≈ 40 °C"], [205, 215, 0.06, "outside", "≈ 30 °C"], [345, 226, 0.02, "water", "≈ 7 °C"], [345, 282, 0.02, "ret", "≈ 12 °C"]],
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
    file: "alvos/3-sala.jpg", w: 474, h: 355, tab: { pt: "Sala", en: "Room" },
    title: { pt: "Ar-condicionado da sala (CRAH)", en: "Room air handler (CRAH)" },
    text: {
      pt: "O CRAH sopra o ar frio por baixo do piso elevado. O ar sobe pelas placas perfuradas, entra pela frente dos racks e o ar quente volta por cima até o CRAH.",
      en: "The CRAH blows cold air under the raised floor. The air rises through the perforated tiles, enters the front of the racks, and the hot air returns overhead to the CRAH.",
    },
    labels: [[265, 318, 0.12, "cold", "≈ 18 °C"], [120, 62, 0.04, "hot", "≈ 35 °C"]],
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
    file: "alvos/4-corredor-quente.jpg", w: 474, h: 631, tab: { pt: "Corredor quente", en: "Hot aisle" },
    title: { pt: "Corredor quente fechado", en: "Enclosed hot aisle" },
    text: {
      pt: "O ar sai quente pela parte de trás dos servidores, fica preso no corredor fechado e sobe pelas grelhas do forro, de volta ao ar-condicionado da sala.",
      en: "Hot air leaves the back of the servers, stays trapped in the enclosed aisle and rises through the ceiling grilles, back to the room's air handler.",
    },
    labels: [[300, 205, 0.08, "hot", "≈ 35 °C"]],
    legend: ["hot"],
    flows(add) {
      for (let i = 0; i < 16; i++) {
        const y = rnd(300, 580), x = rnd(110, 200), xt = rnd(230, 400);
        add([[x, y, 0.02], [x + 90, y - 30, 0.08], [rnd(280, 380), (y + 120) / 2, 0.1], [xt, 110, 0.05], [xt + rnd(-10, 10), 10, 0.02]], COL.hot, COL.hot);
      }
    },
  },
  {
    file: "alvos/5-crah-corte.jpg", w: 474, h: 304, tab: { pt: "CRAH", en: "CRAH" },
    title: { pt: "CRAH por dentro", en: "Inside a CRAH" },
    text: {
      pt: "No CRAH em corte dá para ver o caminho: o ar quente entra por cima, atravessa a serpentina inclinada com água gelada e sai frio por baixo, direto para o vão do piso elevado.",
      en: "The cutaway shows the path: hot air enters at the top, crosses the slanted coil filled with chilled water and leaves cold at the bottom, straight into the raised-floor gap.",
    },
    labels: [[178, 22, 0.02, "hot", "≈ 35 °C"], [235, 222, 0.03, "cold", "≈ 18 °C"]],
    legend: ["hot", "cold"],
    flows(add) {
      for (let i = 0; i < 9; i++) {
        const x = 126 + i * 3.5 + rnd(-2, 2), d = rnd(-5, 5);
        add([[x, -15, 0.02], [x, 60, 0.02], [x - 4, 118, 0.02], [x - 20 + d, 172, 0.02], [x - 10 + d, 214, 0.02],
          [x + 28 + d, 236 + d / 2, 0.02], [x + 88, 240 + d / 2, 0.02]], COL.hot, COL.cold, [0.36, 0.5]);
      }
    },
  },
  {
    file: "alvos/6-predio-corte.jpg", w: 474, h: 304, tab: { pt: "Prédio", en: "Building" },
    title: { pt: "O ciclo em corte", en: "The full loop in section" },
    text: {
      pt: "O corte mostra o ciclo inteiro numa imagem: o ar frio corre por baixo do piso e sobe nos racks, o ar quente volta pelo alto até o CRAH, e a água leva o calor até o chiller no telhado.",
      en: "The section shows the whole loop in one picture: cold air runs under the floor and rises at the racks, hot air returns overhead to the CRAH, and water carries the heat up to the chiller on the roof.",
    },
    labels: [[150, 196, 0.03, "cold", "≈ 18 °C"], [205, 134, 0.03, "hot", "≈ 35 °C"], [345, 172, 0.02, "water", "≈ 7 °C"]],
    legend: ["outside", "cold", "hot", "water", "ret"],
    flows(add) {
      // ar frio: sai do CRAH, corre pelo vão do piso e sobe no corredor frio
      for (let i = 0; i < 8; i++) {
        const xt = 205 + i * 5 + rnd(-2, 2);
        add([[72, 196, 0.02], [92, 206, 0.02], [xt - 40, 207, 0.02], [xt, 202, 0.02], [xt + rnd(-3, 3), 168, 0.02]], COL.cold, COL.cold);
      }
      // ar quente: sobe dos racks e volta pelo alto até o CRAH
      for (const x0 of [172, 272, 280, 286]) for (let k = 0; k < 2; k++) {
        const xe = rnd(66, 120);
        add([[x0 + rnd(-3, 3), 170, 0.02], [x0, 146, 0.02], [x0 - 50, 140, 0.02], [xe + 20, 142, 0.02], [xe, 150, 0.02], [xe, 160, 0.02]], COL.hot, COL.hot);
      }
      // chiller: ar da rua entra pelas laterais e sai quente pelos ventiladores
      for (let i = 0; i < 5; i++) {
        const x = 172 + i * 22 + rnd(-3, 3);
        add([[x, 114, 0.08], [x, 100, 0.02], [x, 78, 0.01], [x + rnd(-5, 5), -10, 0.03]], COL.outside, COL.hot, [0.3, 0.5]);
      }
      // água: ida gelada e volta mais quente, entre o chiller e o CRAH
      add([[268, 120, 0.01], [312, 123, 0.01], [313, 212, 0.01], [40, 212, 0.01], [36, 196, 0.01], [50, 194, 0.01]], COL.water, COL.water);
      add([[54, 199, 0.01], [32, 200, 0.01], [36, 216, 0.01], [316, 216, 0.01], [317, 125, 0.01], [275, 124, 0.01]], COL.ret, COL.ret);
    },
  },
];

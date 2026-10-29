// As 11 fotos, na mesma ordem do arquivo alvos.mind.
// Coordenadas em pixels da foto original (474 de largura); z = quanto o fluxo sai da foto, em larguras da foto.
// labels: etiquetas [px, py, z, fluxo, valor] presas à foto. tab/title/text vêm em PT e EN. videos: chaves de VIDEOS (js/shared/videos.js).
// flows(add) desenha os caminhos: add(pontos, cor inicial, cor final, faixa da transição).
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
    legend: ["cold", "hot"], videos: ["crah"],
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
    legend: ["hot", "cold"], videos: ["crah", "crac"],
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
  {
    file: "alvos/7-chiller-trane.jpg", w: 474, h: 266, tab: { pt: "Compressores", en: "Compressors" },
    title: { pt: "Chiller por dentro", en: "Inside an air-cooled chiller" },
    text: {
      pt: "Sem a lateral dá para ver o que fica embaixo dos V: os compressores e o trocador onde a água do data center é gelada. Os ventiladores puxam o ar da rua pelas serpentinas e jogam o calor para cima, e a água sai gelada pela bomba.",
      en: "With the side panel off you can see what sits under the Vs: the compressors and the heat exchanger where the data center's water gets chilled. The fans pull outside air through the coils and throw the heat upward, and the chilled water leaves through the pump.",
    },
    labels: [[300, 8, 0.05, "hot", "≈ 40 °C"], [140, 172, 0.22, "outside", "≈ 30 °C"], [440, 128, 0.04, "water", "≈ 7 °C"], [430, 202, 0.04, "ret", "≈ 12 °C"]],
    legend: ["outside", "hot", "water", "ret"],
    flows(add) {
      // ar da rua: entra pelos V da lateral e sai quente pelos ventiladores do topo
      for (let i = 0; i < 14; i++) {
        const x = 110 + i * 22 + rnd(-6, 6), y = rnd(115, 150);
        add([[x - 15, y + 30, 0.25], [x, y, 0.04], [x + 2, 95, 0.02], [x + 4, 45, 0.02], [x + rnd(-12, 12), -30, 0.05]], COL.outside, COL.hot, [0.4, 0.6]);
      }
      // água: sai gelada do trocador pela bomba e volta mais quente
      add([[230, 185, 0.03], [290, 175, 0.03], [340, 160, 0.03], [372, 150, 0.03], [420, 140, 0.04], [470, 138, 0.05]], COL.water, COL.water);
      add([[470, 175, 0.05], [420, 190, 0.04], [340, 205, 0.03], [260, 212, 0.03], [235, 205, 0.03]], COL.ret, COL.ret);
    },
  },
  {
    file: "alvos/8-planta-chillers.jpg", w: 474, h: 266, tab: { pt: "Planta", en: "Plant" },
    title: { pt: "Vários chillers lado a lado", en: "A row of chillers" },
    text: {
      pt: "Data centers maiores juntam vários chillers. O tubo azul reúne a água gelada de todos e leva para as bombas e para as salas. O vermelho traz a água de volta mais quente e reparte entre os chillers. Se um parar, os outros seguram a carga.",
      en: "Larger data centers group several chillers. The blue pipe collects the chilled water from all of them and sends it to the pumps and the rooms. The red one brings the warmer water back and shares it among the chillers. If one stops, the others carry the load.",
    },
    labels: [[70, 15, 0.08, "hot", "≈ 40 °C"], [200, 160, 0.02, "water", "≈ 7 °C"], [262, 56, 0.02, "ret", "≈ 12 °C"]],
    legend: ["outside", "hot", "water", "ret"],
    flows(add) {
      // ar quente saindo pelos ventiladores de cada chiller
      for (let i = 0; i < 10; i++) {
        const x = 45 + i * 20 + rnd(-5, 5), y = 45 + (x - 40) * 0.33;
        add([[x, y + 35, 0.2], [x, y + 8, 0.03], [x, y - 8, 0.02], [x + rnd(-8, 8), y - 70, 0.05]], COL.outside, COL.hot, [0.35, 0.55]);
      }
      // tubo azul: água gelada indo para as bombas; tubo vermelho: retorno subindo e voltando aos chillers
      add([[12, 78, 0.01], [80, 105, 0.01], [150, 135, 0.01], [240, 172, 0.01], [252, 182, 0.01], [322, 214, 0.01], [335, 238, 0.01]], COL.water, COL.water);
      add([[350, 240, 0.01], [365, 190, 0.01], [372, 140, 0.01], [340, 100, 0.01], [305, 76, 0.01], [200, 48, 0.01], [122, 28, 0.01], [128, 60, 0.01]], COL.ret, COL.ret);
    },
  },
  {
    file: "alvos/9-casa-de-maquinas.jpg", w: 474, h: 345, tab: { pt: "Casa de máquinas", en: "Plant room" },
    title: { pt: "Chillers a água, com torres", en: "Water-cooled chillers with towers" },
    text: {
      pt: "Outra forma de montar o sistema: os chillers ficam numa casa de máquinas e, em vez de jogar o calor direto no ar, passam para uma segunda água, a do condensador. Ela sobe até as torres de resfriamento, esfria e volta. A água gelada das salas segue igual.",
      en: "Another way to build the system: the chillers sit in a plant room and, instead of throwing the heat straight into the air, pass it to a second water loop, the condenser water. It goes up to the cooling towers, cools down and comes back. The chilled water for the rooms works the same.",
    },
    labels: [[170, 5, 0.07, "hot", "≈ 32 °C"], [40, 170, 0.03, "cond", "≈ 35 °C"], [400, 165, 0.03, "water", "≈ 7 °C"], [395, 128, 0.03, "ret", "≈ 12 °C"]],
    legend: ["outside", "hot", "cond", "water", "ret"],
    flows(add) {
      // torres: o ar sai quente e úmido pelos ventiladores
      for (const fx of [88, 112, 165, 190, 228, 252]) {
        add([[fx + rnd(-6, 6), 72, 0.12], [fx, 50, 0.03], [fx, 22, 0.02], [fx + rnd(-8, 8), -30, 0.06]], COL.outside, COL.hot, [0.35, 0.55]);
      }
      // água do condensador: sai quente dos chillers até as torres e volta mais fria
      add([[330, 182, 0.01], [270, 203, 0.01], [215, 220, 0.01], [165, 236, 0.01], [120, 258, 0.01], [110, 250, 0.01], [80, 175, 0.01], [65, 108, 0.01], [80, 98, 0.01], [140, 70, 0.01], [200, 52, 0.01]], COL.cond, COL.cond);
      add([[270, 58, 0.01], [150, 86, 0.01], [80, 108, 0.01], [78, 130, 0.01], [105, 200, 0.01], [132, 232, 0.01], [175, 238, 0.01], [215, 215, 0.01]], COL.cond, COL.cond);
      // água gelada para as salas e retorno
      add([[200, 222, 0.03], [260, 200, 0.03], [325, 177, 0.03], [390, 150, 0.03]], COL.water, COL.water);
      add([[385, 140, 0.03], [330, 160, 0.03], [270, 182, 0.03], [215, 205, 0.03]], COL.ret, COL.ret);
    },
  },
  {
    file: "alvos/10-torres.jpg", w: 474, h: 370, tab: { pt: "Torres", en: "Towers" },
    title: { pt: "Torres de resfriamento", en: "Cooling towers" },
    text: {
      pt: "A água do condensador chega quente pelos tubos e é espalhada no alto da torre. Ela escorre por dentro enquanto o ventilador do topo puxa o ar da rua pelas laterais. Parte da água evapora e leva o calor junto, e o resto sai embaixo mais fria, de volta aos chillers.",
      en: "Condenser water arrives hot through the pipes and is spread at the top of the tower. It trickles down inside while the fan on top pulls outside air through the sides. Some of the water evaporates and takes the heat with it, and the rest leaves at the bottom cooler, back to the chillers.",
    },
    labels: [[290, 12, 0.08, "hot", "≈ 32 °C"], [40, 250, 0.03, "cond", "≈ 35 °C"], [130, 330, 0.03, "cond", "≈ 29 °C"], [410, 250, 0.2, "outside", "≈ 30 °C"]],
    legend: ["outside", "hot", "cond"],
    flows(add) {
      // ar: entra pelas grelhas das laterais e sai pelo ventilador de cada torre
      for (let i = 0; i < 6; i++) {
        const x = rnd(170, 225), y = rnd(90, 165);
        add([[x - 25, y + 10, 0.25], [x, y, 0.03], [(x + 228) / 2, 85, 0.02], [228 + rnd(-12, 12), 55, 0.02], [228 + rnd(-15, 15), -30, 0.06]], COL.outside, COL.hot, [0.45, 0.65]);
      }
      for (let i = 0; i < 8; i++) {
        const x = rnd(270, 365), y = rnd(140, 230);
        add([[x - 20, y + 15, 0.25], [x, y, 0.03], [(x + 350) / 2, 130, 0.02], [350 + rnd(-15, 15), 100, 0.02], [350 + rnd(-20, 20), -20, 0.06]], COL.outside, COL.hot, [0.45, 0.65]);
      }
      // água do condensador: sobe quente pelo tubo roxo até o alto e sai fria pelo laranja
      add([[60, 318, 0.02], [62, 262, 0.02], [110, 248, 0.02], [175, 218, 0.02], [215, 240, 0.02], [252, 258, 0.02], [253, 180, 0.02], [254, 102, 0.02], [320, 78, 0.02], [385, 58, 0.02]], COL.cond, COL.cond);
      add([[300, 262, 0.02], [250, 238, 0.02], [210, 212, 0.02], [150, 232, 0.02], [100, 270, 0.02], [80, 300, 0.02], [82, 335, 0.02]], COL.cond, COL.cond);
    },
  },
  {
    file: "alvos/11-torre-por-dentro.jpg", w: 474, h: 471, tab: { pt: "Torre por dentro", en: "Inside a tower" },
    title: { pt: "Torre de circuito fechado", en: "Closed-circuit cooling tower" },
    text: {
      pt: "Nesta torre a água quente corre dentro de uma serpentina e não encosta no ar. O ar da rua entra pelas grelhas de baixo, sobe pela serpentina molhada por um spray de água e sai quente pelos ventiladores. A água sai embaixo, mais fria.",
      en: "In this tower the hot water runs inside a coil and never touches the air. Outside air enters through the lower grilles, rises across the coil, which is wetted by a water spray, and leaves hot through the fans. The water comes out at the bottom, cooler.",
    },
    labels: [[270, 30, 0.07, "hot", "≈ 32 °C"], [420, 290, 0.1, "outside", "≈ 30 °C"], [60, 160, 0.04, "cond", "≈ 35 °C"], [90, 284, 0.04, "cond", "≈ 29 °C"]],
    legend: ["outside", "hot", "cond"],
    flows(add) {
      // ar: entra pelas grelhas de baixo (dos dois lados), sobe pela serpentina e sai pelos 2 ventiladores
      const rise = (start, fx) => {
        const x = rnd(185, 255);
        add([...start, [x, 280, 0.01], [x, 210, 0.01], [fx + rnd(-15, 15), 125, 0.02], [fx + rnd(-25, 25), 15, 0.06]], COL.outside, COL.hot, [0.45, 0.65]);
      };
      for (let i = 0; i < 7; i++) rise([[480, rnd(305, 325), 0.12], [400, 315, 0.05], [330, 328, 0.02]], i % 2 ? 305 : 220);
      for (let i = 0; i < 4; i++) rise([[70, 345, 0.12], [150, 328, 0.04]], i % 2 ? 305 : 220);
      // água: entra quente em cima, desce em zigue-zague pela serpentina e sai fria embaixo
      add([[55, 177, 0.04], [110, 178, 0.02], [160, 180, 0.01], [185, 192, 0.01], [240, 210, 0.01], [185, 232, 0.01], [240, 250, 0.01],
        [185, 268, 0.01], [240, 283, 0.01], [160, 292, 0.01], [110, 293, 0.02], [55, 293, 0.04]], COL.cond, COL.cond);
    },
  },
];

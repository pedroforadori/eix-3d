// Passos do tour: textos (PT/EN), temperaturas, fluxos e rótulos acesos, câmera, e se telhado/forro aparecem.
export const STEPS = [
  {
    eyebrow: { pt: "Visão geral", en: "Overview" }, title: { pt: "Como o data center se mantém frio", en: "How the data center stays cool" },
    text: {
      pt: "O calor dos servidores faz um ciclo: sai pelos racks, volta para o ar-condicionado da sala, passa para a água e é jogado para fora pelo chiller no telhado. Toque em Próximo para seguir o caminho.",
      en: "Server heat travels in a loop: it leaves the racks, goes back to the room's air handler, moves into the water and is pushed outside by the chiller on the roof. Tap Next to follow the path.",
    },
    temps: [], flows: ["outside", "water", "crah", "coil", "floor", "racks", "return"],
    cam: [15, 9, 17], target: [-0.5, 3, 0], roof: true, labels: ["chiller", "crah", "cold", "hot", "floor"],
  },
  {
    eyebrow: { pt: "Passo 1 de 6", en: "Step 1 of 6" }, title: { pt: "Chiller no telhado", en: "Chiller on the roof" },
    text: {
      pt: "Os ventiladores em cima puxam o ar da rua pelas serpentinas em V nas laterais. Esse ar leva embora o calor da água e sai quente por cima da máquina.",
      en: "The fans on top pull outside air through the V-shaped coils on the sides. That air carries the heat away from the water and leaves hot through the top of the unit.",
    },
    temps: [[{ pt: "Ar da rua", en: "Outside air" }, "≈ 30 °C"], [{ pt: "Saída dos ventiladores", en: "Fan discharge" }, "≈ 40 °C"]], flows: ["outside"],
    cam: [9, 11.5, 11], target: [0, 6.4, 0], roof: true, labels: ["chiller"],
  },
  {
    eyebrow: { pt: "Passo 2 de 6", en: "Step 2 of 6" }, title: { pt: "Água gelada desce para a sala", en: "Chilled water goes down to the room" },
    text: {
      pt: "A água sai gelada do chiller, desce pela tubulação até o ar-condicionado da sala (CRAH) e volta mais quente, trazendo o calor que tirou do ar.",
      en: "Water leaves the chiller cold, runs down the pipes to the room's air handler (CRAH) and comes back warmer, carrying the heat it took from the air.",
    },
    temps: [[{ pt: "Ida", en: "Supply" }, "≈ 7 °C"], [{ pt: "Retorno", en: "Return" }, "≈ 12 °C"]], flows: ["water"],
    cam: [1, 8, 10], target: [-5.5, 4, -0.8], roof: true, labels: ["chiller", "crah"],
  },
  {
    eyebrow: { pt: "Passo 3 de 6", en: "Step 3 of 6" }, title: { pt: "Dentro do CRAH", en: "Inside the CRAH" },
    text: {
      pt: "O ar quente de retorno entra por cima do CRAH, passa pelo filtro e atravessa a serpentina. A água gelada que corre dentro dela absorve o calor, e o ar sai frio. Os ventiladores de baixo empurram esse ar para dentro do piso elevado.",
      en: "Hot return air enters the top of the CRAH, goes through the filter and crosses the cooling coil. The chilled water running inside the coil absorbs the heat, so the air comes out cold. The fans underneath push it down into the raised floor.",
    },
    temps: [[{ pt: "Ar que entra", en: "Air in" }, "≈ 35 °C"], [{ pt: "Ar que sai", en: "Air out" }, "≈ 18 °C"], [{ pt: "Água", en: "Water" }, "7 → 12 °C"]],
    flows: ["crah", "coil"], videos: ["crah", "crac"],
    cam: [-2.2, 3.9, 6.4], target: [-7.4, 1.8, 0], roof: false, ceil: false, labels: ["crah", "coil", "fans"],
  },
  {
    eyebrow: { pt: "Passo 4 de 6", en: "Step 4 of 6" }, title: { pt: "Ar frio por baixo do piso", en: "Cold air under the floor" },
    text: {
      pt: "O CRAH sopra o ar frio para baixo do piso elevado. O ar corre pelo vão e sobe pelas placas perfuradas no corredor frio, bem na frente dos servidores.",
      en: "The CRAH blows cold air under the raised floor. The air flows through the gap and rises through the perforated tiles in the cold aisle, right in front of the servers.",
    },
    temps: [[{ pt: "Saída do CRAH", en: "CRAH outlet" }, "≈ 18 °C"], [{ pt: "Corredor frio", en: "Cold aisle" }, "≈ 22 °C"]], flows: ["floor"],
    cam: [5, 7.5, 11], target: [-2, 0.6, 0], roof: false, ceil: false, labels: ["crah", "floor", "cold"],
  },
  {
    eyebrow: { pt: "Passo 5 de 6", en: "Step 5 of 6" }, title: { pt: "O ar passa pelos servidores", en: "Air passes through the servers" },
    text: {
      pt: "Os servidores puxam o ar frio pela frente e soltam pela parte de trás. É aqui que o ar esquenta e vai para o corredor quente, que fica fechado.",
      en: "The servers draw cold air in at the front and push it out the back. This is where the air heats up and goes into the hot aisle, which is enclosed.",
    },
    temps: [[{ pt: "Entrada dos racks", en: "Rack inlet" }, "≈ 22 °C"], [{ pt: "Corredor quente", en: "Hot aisle" }, "≈ 35 °C"]], flows: ["racks"],
    cam: [4, 8, 6], target: [0.5, 1.2, 0], roof: false, ceil: false, labels: ["cold", "hot"],
  },
  {
    eyebrow: { pt: "Passo 6 de 6", en: "Step 6 of 6" }, title: { pt: "Ar quente volta pelo forro", en: "Hot air returns through the ceiling" },
    text: {
      pt: "O ar quente sobe pelas grelhas do forro e corre por cima até o CRAH, que passa o calor para a água. A água leva o calor ao chiller, e o ciclo recomeça.",
      en: "Hot air rises through the ceiling grilles and travels overhead to the CRAH, which passes the heat to the water. The water carries the heat to the chiller, and the cycle starts again.",
    },
    temps: [[{ pt: "Retorno ao CRAH", en: "Return to CRAH" }, "≈ 35 °C"], [{ pt: "Água de volta", en: "Water back" }, "≈ 12 °C"]], flows: ["return", "water"],
    cam: [6, 7, 10], target: [-2.5, 2.8, 0], roof: false, labels: ["hot", "crah"],
  },
];

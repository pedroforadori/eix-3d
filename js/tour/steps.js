// Passos do tour: textos, temperaturas, fluxos e rótulos acesos, câmera, e se telhado/forro aparecem.
export const STEPS = [
  {
    eyebrow: "Visão geral", title: "Como o data center se mantém frio",
    text: "O calor dos servidores faz um ciclo: sai pelos racks, volta para o ar-condicionado da sala, passa para a água e é jogado para fora pelo chiller no telhado. Toque em Próximo para seguir o caminho.",
    temps: [], flows: ["outside", "water", "floor", "racks", "return"],
    cam: [15, 9, 17], target: [-0.5, 3, 0], roof: true, labels: ["chiller", "crah", "cold", "hot", "floor"],
  },
  {
    eyebrow: "Passo 1 de 5", title: "Chiller no telhado",
    text: "Os ventiladores em cima puxam o ar da rua pelas serpentinas em V nas laterais. Esse ar leva embora o calor da água e sai quente por cima da máquina.",
    temps: [["Ar da rua", "≈ 30 °C"], ["Saída dos ventiladores", "≈ 40 °C"]], flows: ["outside"],
    cam: [9, 11.5, 11], target: [0, 6.4, 0], roof: true, labels: ["chiller"],
  },
  {
    eyebrow: "Passo 2 de 5", title: "Água gelada desce para a sala",
    text: "A água sai gelada do chiller, desce pela tubulação até o ar-condicionado da sala (CRAH) e volta mais quente, trazendo o calor que tirou do ar.",
    temps: [["Ida", "≈ 7 °C"], ["Retorno", "≈ 12 °C"]], flows: ["water"],
    cam: [1, 8, 10], target: [-5.5, 4, -0.8], roof: true, labels: ["chiller", "crah"],
  },
  {
    eyebrow: "Passo 3 de 5", title: "Ar frio por baixo do piso",
    text: "O CRAH sopra o ar frio para baixo do piso elevado. O ar corre pelo vão e sobe pelas placas perfuradas no corredor frio, bem na frente dos servidores.",
    temps: [["Saída do CRAH", "≈ 18 °C"], ["Corredor frio", "≈ 22 °C"]], flows: ["floor"],
    cam: [5, 7.5, 11], target: [-2, 0.6, 0], roof: false, ceil: false, labels: ["crah", "floor", "cold"],
  },
  {
    eyebrow: "Passo 4 de 5", title: "O ar passa pelos servidores",
    text: "Os servidores puxam o ar frio pela frente e soltam pela parte de trás. É aqui que o ar esquenta e vai para o corredor quente, que fica fechado.",
    temps: [["Entrada dos racks", "≈ 22 °C"], ["Corredor quente", "≈ 35 °C"]], flows: ["racks"],
    cam: [4, 8, 6], target: [0.5, 1.2, 0], roof: false, ceil: false, labels: ["cold", "hot"],
  },
  {
    eyebrow: "Passo 5 de 5", title: "Ar quente volta pelo forro",
    text: "O ar quente sobe pelas grelhas do forro e corre por cima até o CRAH, que passa o calor para a água. A água leva o calor ao chiller, e o ciclo recomeça.",
    temps: [["Retorno ao CRAH", "≈ 35 °C"], ["Água de volta", "≈ 12 °C"]], flows: ["return", "water"],
    cam: [6, 7, 10], target: [-2.5, 2.8, 0], roof: false, labels: ["hot", "crah"],
  },
];

// Painel do passo: textos, temperaturas, pontinhos e Anterior/Próximo.
import { $ } from "../shared/dom.js";

// go(i) é chamado quando o usuário pede outro passo; render(i) mostra o passo i.
export function createPanel(steps, { go }) {
  let current = 0;
  const dots = $("dots");
  steps.forEach((s, i) => {
    const b = document.createElement("button"); b.setAttribute("aria-label", s.title);
    b.addEventListener("click", () => go(i)); dots.appendChild(b);
  });
  $("prev").addEventListener("click", () => go(current - 1));
  $("next").addEventListener("click", () => go(current === steps.length - 1 ? 0 : current + 1));

  function render(i) {
    current = i;
    const s = steps[i];
    $("eyebrow").textContent = s.eyebrow; $("title").textContent = s.title; $("text").textContent = s.text;
    $("temps").innerHTML = s.temps.map(([a, b]) => `<span>${a} <b>${b}</b></span>`).join("");
    $("prev").disabled = i === 0;
    $("next").textContent = i === steps.length - 1 ? "Recomeçar" : "Próximo";
    [...dots.children].forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
  }
  return { render };
}

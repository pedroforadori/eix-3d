// Painel do passo: textos, temperaturas, pontinhos e Anterior/Próximo.
import { $ } from "../shared/dom.js";
import { tr } from "../shared/i18n.js";
import { STRINGS } from "../shared/strings.js";

// go(i) é chamado quando o usuário pede outro passo; render(i) mostra o passo i.
export function createPanel(steps, { go }) {
  let current = 0;
  const dots = $("dots");
  steps.forEach((s, i) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => go(i)); dots.appendChild(b);
  });
  $("prev").addEventListener("click", () => go(current - 1));
  $("next").addEventListener("click", () => go(current === steps.length - 1 ? 0 : current + 1));

  function render(i) {
    current = i;
    const s = steps[i];
    $("eyebrow").textContent = tr(s.eyebrow); $("title").textContent = tr(s.title); $("text").textContent = tr(s.text);
    $("temps").innerHTML = s.temps.map(([a, b]) => `<span>${tr(a)} <b>${b}</b></span>`).join("");
    $("prev").disabled = i === 0;
    $("next").textContent = tr(i === steps.length - 1 ? STRINGS.restart : STRINGS.next);
    [...dots.children].forEach((d, k) => {
      d.setAttribute("aria-current", k === i ? "true" : "false"); d.setAttribute("aria-label", tr(steps[k].title));
    });
  }
  // refresh() redesenha o passo atual (troca de idioma)
  return { render, refresh: () => render(current) };
}

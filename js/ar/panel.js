// Painel da foto: textos, legenda, abas e mensagens da câmera.
import { $ } from "../shared/dom.js";
import { FLOW_LABELS } from "../shared/palette.js";

// select(i) é chamado quando o usuário escolhe uma aba.
export function createPanel(targets, { select }) {
  targets.forEach((t, i) => {
    const b = document.createElement("button"); b.textContent = t.tab;
    b.addEventListener("click", () => select(i)); $("tabs").appendChild(b);
  });

  function show(i) {
    const t = targets[i];
    $("eyebrow").textContent = `Foto ${i + 1} de ${targets.length}`;
    $("title").textContent = t.title; $("text").textContent = t.text;
    $("legend").innerHTML = t.legend.map(k => `<span><i style="background:${FLOW_LABELS[k][1]}"></i>${FLOW_LABELS[k][0]}</span>`).join("");
    [...$("tabs").children].forEach((b, k) => b.setAttribute("aria-pressed", k === i ? "true" : "false"));
  }
  function waiting() {
    $("eyebrow").textContent = "Câmera ligada";
    $("title").textContent = "Aponte para uma das fotos";
    $("text").textContent = "Mostre na tela ou no slide uma das 4 fotos (telhado, chiller, sala ou corredor quente). Os fluxos aparecem em cima dela.";
    $("legend").innerHTML = "";
  }
  const setTabsHidden = hidden => { $("tabs").hidden = hidden; };
  function message(text, isError = false) {
    $("msg").className = isError ? "msg err" : "msg"; $("msg").textContent = text;
  }
  return { show, waiting, setTabsHidden, message };
}

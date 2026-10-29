// Painel da foto: textos (PT/EN), legenda, vídeos, abas, Anterior/Próximo e mensagens da câmera.
import { $ } from "../shared/dom.js";
import { FLOW_LABELS } from "../shared/palette.js";
import { tr } from "../shared/i18n.js";
import { STRINGS } from "../shared/strings.js";

// select(i) é chamado quando o usuário escolhe uma aba ou usa Anterior/Próximo; videos(el, chaves) põe os botões dos vídeos.
export function createPanel(targets, { select, videos }) {
  let current = 0, view = "photo", msg = ["", false];
  targets.forEach((t, i) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => select(i)); $("tabs").appendChild(b);
  });
  $("prev").addEventListener("click", () => select(Math.max(0, current - 1)));
  $("next").addEventListener("click", () => select(current === targets.length - 1 ? 0 : current + 1));

  function show(i) {
    current = i; view = "photo";
    const t = targets[i];
    $("eyebrow").textContent = tr(STRINGS.photoOf).replace("{i}", i + 1).replace("{n}", targets.length);
    $("title").textContent = tr(t.title); $("text").textContent = tr(t.text);
    $("legend").innerHTML = t.legend.map(k => `<span><i style="background:${FLOW_LABELS[k][1]}"></i>${tr(FLOW_LABELS[k][0])}</span>`).join("");
    videos($("videos"), t.videos);
    [...$("tabs").children].forEach((b, k) => {
      b.textContent = tr(targets[k].tab); b.setAttribute("aria-pressed", k === i ? "true" : "false");
    });
    $("tabs").children[i].scrollIntoView({ block: "nearest", inline: "nearest" }); // no celular as abas rolam de lado
    $("prev").disabled = i === 0;
    $("next").textContent = tr(i === targets.length - 1 ? STRINGS.restart : STRINGS.next);
  }
  function waiting() {
    view = "waiting";
    $("eyebrow").textContent = tr(STRINGS.camOn);
    $("title").textContent = tr(STRINGS.camPoint);
    $("text").textContent = tr(STRINGS.camHelp);
    $("legend").innerHTML = "";
    videos($("videos"));
  }
  // no modo câmera quem escolhe a foto é a câmera, então abas e Anterior/Próximo somem
  const setTabsHidden = hidden => { $("tabs").hidden = hidden; $("nav").hidden = hidden; };
  // message(chave em STRINGS, erro?); message("") limpa
  function message(key, isError = false) {
    msg = [key, isError];
    $("msg").className = isError ? "msg err" : "msg"; $("msg").textContent = key ? tr(STRINGS[key]) : "";
  }
  // refresh() redesenha o que está na tela (troca de idioma)
  function refresh() {
    if (view === "waiting") waiting(); else show(current);
    message(...msg);
  }
  return { show, waiting, setTabsHidden, message, refresh };
}

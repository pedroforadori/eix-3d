// Vídeos de referência (YouTube Shorts) abertos numa janela por cima da página, no tour e nas fotos.
import { $ } from "./dom.js";
import { tr, onLangChange } from "./i18n.js";
import { STRINGS } from "./strings.js";

// button: texto do botão; note: o que reparar no vídeo
export const VIDEOS = {
  crah: {
    id: "lWCHkRE4O9Y", length: "38 s",
    button: { pt: "Vídeo: um CRAH de verdade", en: "Video: a real CRAH" },
    title: { pt: "Como um CRAH resfria o data center", en: "How a CRAH cools a data center" },
    note: {
      pt: "Repare na sequência: a água gelada chega pelos tubos azuis, o ar quente entra por cima, passa pela serpentina e os ventiladores de baixo sopram o ar frio para o piso.",
      en: "Watch the sequence: chilled water arrives through the blue pipes, hot air enters at the top, crosses the coil and the fans underneath blow the cold air into the floor.",
    },
  },
  crac: {
    id: "jSeu8Uc8t5w", length: "10 s",
    button: { pt: "Comparar: CRAC, a gás", en: "Compare: a CRAC, on gas" },
    title: { pt: "CRAC: o primo a gás do CRAH", en: "CRAC: the CRAH's gas-based cousin" },
    note: {
      pt: "O CRAC faz o mesmo caminho de ar, mas tem compressor dentro e resfria com gás refrigerante, como um ar-condicionado de casa. O CRAH deste tour não tem compressor: quem resfria é a água gelada que vem do chiller.",
      en: "A CRAC moves the air the same way, but it has its own compressor and cools with refrigerant gas, like a home air conditioner. The CRAH in this tour has no compressor: the chilled water from the chiller does the cooling.",
    },
  },
};

const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';

// Liga a janela #video. Devolve render(el, chaves), que põe em el os botões dos vídeos (ou esconde el).
export function initVideos() {
  const dialog = $("video");
  let open = null;
  function text() {
    if (!open) return;
    const v = VIDEOS[open];
    $("video-title").textContent = tr(v.title); $("video-note").textContent = tr(v.note);
    $("video-frame").querySelector("iframe")?.setAttribute("title", tr(v.title));
  }
  function play(key) {
    open = key;
    const v = VIDEOS[key];
    $("video-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $("video-link").href = `https://www.youtube.com/shorts/${v.id}`;
    text();
    dialog.showModal();
  }
  // fechar tira o iframe, o que para o vídeo
  dialog.addEventListener("close", () => { $("video-frame").innerHTML = ""; open = null; });
  $("video-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); }); // toque fora da caixa
  onLangChange(text);

  return function render(el, keys = []) {
    el.hidden = !keys.length;
    el.innerHTML = keys.map(k => `<button class="video-btn" data-video="${k}">${PLAY}<span>${tr(VIDEOS[k].button)}</span><small>${VIDEOS[k].length}</small></button>`).join("");
    el.querySelectorAll("button").forEach(b => b.addEventListener("click", () => play(b.dataset.video)));
    el.setAttribute("aria-label", tr(STRINGS.videos));
  };
}

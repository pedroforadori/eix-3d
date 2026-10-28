// Idioma da página (PT/EN): escolha guardada no navegador e textos fixos marcados no HTML.
// data-i18n="chave" troca o texto do elemento; data-i18n-aria="chave" troca o aria-label.
const LANGS = ["pt", "en"];
const KEY = "eix-lang";

function initialLang() {
  const q = new URLSearchParams(location.search).get("lang"); // ?lang=pt ou ?lang=en num link direto
  if (LANGS.includes(q)) return q;
  try { const saved = localStorage.getItem(KEY); if (LANGS.includes(saved)) return saved; } catch { /* sem storage */ }
  return "en"; // padrão: inglês
}

let lang = initialLang();
let strings = {};
const listeners = [];

// tr({ pt, en }) devolve o texto no idioma atual
export const tr = text => (typeof text === "string" ? text : text[lang] ?? text.en);
export const onLangChange = fn => listeners.push(fn);

function applyStatic() {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = tr(strings[el.dataset.i18n]); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", tr(strings[el.dataset.i18nAria])));
  document.querySelectorAll("button[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
}
export function setLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  try { localStorage.setItem(KEY, l); } catch { /* sem storage */ }
  applyStatic();
  listeners.forEach(fn => fn(l));
}
// liga os botões PT/EN e aplica o idioma inicial aos textos fixos
export function initI18n(dict, switchEl) {
  strings = dict;
  switchEl.querySelectorAll("button[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  applyStatic();
}

export const $ = id => document.getElementById(id);

// Faixa livre da tela entre a barra do topo e o painel de baixo:
// shift = quanto subir a cena (para camera.setViewOffset), frac = altura livre / altura da tela.
export function freeArea() {
  const h = window.innerHeight;
  const top = document.querySelector(".top")?.getBoundingClientRect().bottom ?? 0;
  const bottom = document.querySelector(".card")?.getBoundingClientRect().top ?? h;
  return { shift: h / 2 - (top + bottom) / 2, frac: Math.max(0.25, (bottom - top) / h) };
}

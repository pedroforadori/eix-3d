// Painel de baixo: no celular começa recolhido (título + Anterior/Próximo) e abre ao tocar no título.
// onResize() é chamado sempre que a altura do painel muda, para a cena se reenquadrar.
export function initCard(card, head, toggle, onResize) {
  card.classList.add("collapsed");
  head.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", !card.classList.toggle("collapsed"));
  });
  new ResizeObserver(() => onResize()).observe(card);
}

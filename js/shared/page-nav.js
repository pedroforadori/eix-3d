// Navegação entre as duas páginas: exposta no desktop, dentro do hambúrguer no celular.

// Balão aberto por um botão: fecha com toque fora ou Esc. Devolve close().
export function initPopover(el, button) {
  const close = () => { el.classList.remove("open"); button.setAttribute("aria-expanded", "false"); };
  button.addEventListener("click", e => {
    e.stopPropagation();
    button.setAttribute("aria-expanded", el.classList.toggle("open"));
  });
  document.addEventListener("click", e => { if (!el.contains(e.target)) close(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  return close;
}

export function initPageNav(nav, button) {
  const close = initPopover(nav, button);
  // a página atual não recarrega, só fecha o menu
  nav.querySelector("[aria-current=page]").addEventListener("click", e => { e.preventDefault(); close(); });
  // escolher o modo fecha o menu para mostrar a cena; trocar o idioma não fecha, para ver a tradução
  nav.querySelectorAll(".mode button").forEach(b => b.addEventListener("click", close));
}

// Navegação entre as duas páginas: exposta no desktop, dentro do hambúrguer no celular.
export function initPageNav(nav, button) {
  const close = () => { nav.classList.remove("open"); button.setAttribute("aria-expanded", "false"); };
  button.addEventListener("click", e => {
    e.stopPropagation();
    button.setAttribute("aria-expanded", nav.classList.toggle("open"));
  });
  // a página atual não recarrega, só fecha o menu
  nav.querySelector("[aria-current=page]").addEventListener("click", e => { e.preventDefault(); close(); });
  document.addEventListener("click", e => { if (!nav.contains(e.target)) close(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

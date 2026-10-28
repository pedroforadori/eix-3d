// Guarda o passo/foto no endereço, para links diretos (#passo-3, #foto-2...).
export const setHash = key => history.replaceState(null, "", "#" + key);
export const onHashChange = route => window.addEventListener("hashchange", () => route(location.hash));

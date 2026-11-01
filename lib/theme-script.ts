export const CHAVE_TEMA = "tema";

// Roda no <head> antes da primeira pintura: aplica o tema escolhido no botão, se houver.
// Sem escolha salva, vale a preferência do sistema (via CSS), sem piscar.
export const themeScript = `(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(CHAVE_TEMA)});
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch (e) {}
})();`;

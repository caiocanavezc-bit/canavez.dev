// Revelação ao rolar, inteira num script inline no <head>: não depende do bundle do React.
// Se o JS do site falhar ao carregar, nada fica invisível, e o que já está na tela aparece
// assim que o HTML termina de ser lido, sem esperar a hidratação.
// Sem IntersectionObserver (navegador muito antigo), a classe "js" não é posta e tudo aparece.
// Um MutationObserver cobre os elementos que chegam em navegações do lado do cliente.
export const revealScript = `(function () {
  if (!("IntersectionObserver" in window)) return;
  var d = document.documentElement;
  d.classList.add("js");
  function iniciar() {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-revealed", "");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    function varrer() {
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(function (el) {
        io.observe(el);
      });
    }
    varrer();
    new MutationObserver(varrer).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();`;

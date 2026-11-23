(function () {
  const root = document.documentElement;

  function aplicarTema(claro) {
    root.classList.toggle("modo-claro", claro);
    if (document.body) {
      document.body.classList.toggle("modo-claro", claro);
    }
    const btn = document.getElementById("btn-tema");
    if (btn) {
      btn.textContent = claro ? "🌙" : "☀️";
    }
  }

  // Aplica imediatamente
  aplicarTema(localStorage.getItem("tema") === "claro");

  // Atualiza o ícone do botão assim que o HTML terminar de carregar
  document.addEventListener("DOMContentLoaded", () => {
    aplicarTema(localStorage.getItem("tema") === "claro");
  });

  // Captura o clique no botão em qualquer lugar da página
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#btn-tema");
    if (!btn) return;

    const vaiParaClaro = !root.classList.contains("modo-claro");
    localStorage.setItem("tema", vaiParaClaro ? "claro" : "escuro");
    aplicarTema(vaiParaClaro);
  });
})();
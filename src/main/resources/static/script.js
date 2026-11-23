let todosOsLivros = [];
let categoriaAtiva = "todas";

const lista = document.getElementById("lista-livros");
const campoBusca = document.getElementById("campo-busca");
const botaoBusca = document.getElementById("botao-busca");
const filtroCategorias = document.getElementById("filtro-categorias");
const contador = document.getElementById("contador-livros");



async function carregarLivros() {

    try {

        const resposta = await fetch("/livros");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar livros");
        }

        todosOsLivros = await resposta.json();

        montarFiltroCategorias();

        aplicarFiltros();

    } catch (erro) {

        console.error(erro);

        lista.innerHTML =
            "<p>Não foi possível carregar os livros</p>";
    }
}



function mostrarLivros(livros) {

    if (livros.length === 0) {

        lista.innerHTML =
            "<p>Nenhum livro encontrado.</p>";

        return;
    }


    lista.innerHTML = "";


    livros.forEach(livro => {

        const card = document.createElement("div");

        card.className = "livro-card";

        card.style.cursor = "pointer";


        card.addEventListener("click", () => {

            window.location.href =
                `livro.html?id=${livro.id}`;

        });


        card.innerHTML = `

            <div class="livro-imagem">

                ${
                    livro.imagem
                        ? `<img src="${livro.imagem}" alt="${livro.titulo}">`
                        : `<span>Sem imagem</span>`
                }

            </div>


            <div class="livro-info">

                <h3>${livro.titulo}</h3>

                <p class="autor">
                    ${livro.autor}
                </p>

                <p class="preco">
                    R$ ${Number(livro.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <p class="conservacao">
                    ${livro.estadoConservacao ||
                    "Não informado"}
                </p>
                <p>
                    ${livro.usuario?.cidade || "Cidade não informada"} -
                    ${livro.usuario?.estado || ""}
                </p>

            </div>

        `;


        const img = card.querySelector(".livro-imagem img");

        if (img) {
            img.addEventListener("error", () => {
                img.replaceWith(
                    Object.assign(document.createElement("span"), {
                        textContent: "Sem imagem"
                    })
                );
            });
        }

        lista.appendChild(card);

    });
}



function nomeCategoria(livro) {
    return livro.categoria?.nome || "Outros";
}


function montarFiltroCategorias() {

    const contagem = {};

    todosOsLivros.forEach(livro => {
        const nome = nomeCategoria(livro);
        contagem[nome] = (contagem[nome] || 0) + 1;
    });

    const nomes = Object.keys(contagem).sort((a, b) => a.localeCompare(b, "pt-BR"));

    filtroCategorias.innerHTML = "";

    const criarChip = (valor, texto, quantidade) => {

        const chip = document.createElement("button");

        chip.type = "button";
        chip.className = "chip";
        chip.dataset.categoria = valor;
        chip.textContent = `${texto} (${quantidade})`;

        chip.addEventListener("click", () => {
            categoriaAtiva = valor;
            aplicarFiltros();
        });

        filtroCategorias.appendChild(chip);
    };

    criarChip("todas", "Todos", todosOsLivros.length);

    nomes.forEach(nome => criarChip(nome, nome, contagem[nome]));
}


function aplicarFiltros() {

    const termo = campoBusca.value.trim().toLowerCase();

    const resultados = todosOsLivros.filter(livro => {

        if (categoriaAtiva !== "todas" && nomeCategoria(livro) !== categoriaAtiva) {
            return false;
        }

        if (termo === "") {
            return true;
        }

        return livro.titulo.toLowerCase().includes(termo)
            || livro.autor.toLowerCase().includes(termo);
    });

    filtroCategorias.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("ativo", chip.dataset.categoria === categoriaAtiva);
    });

    contador.textContent =
        resultados.length === 1
            ? "1 livro encontrado"
            : `${resultados.length} livros encontrados`;

    mostrarLivros(resultados);
}


function buscarLivros() {
    aplicarFiltros();
}

function irParaAnunciar() {

    const usuario = localStorage.getItem("usuario");

    if (usuario) {
        window.location.href = "anunciar.html";
    } else {
        window.location.href = "login.html";
    }
}



botaoBusca.addEventListener(
    "click",
    buscarLivros
);


campoBusca.addEventListener(
    "keydown",
    evento => {

        if (evento.key === "Enter") {

            buscarLivros();

        }

    }
);





















document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btn-tema");

  if (localStorage.getItem("tema") === "claro") {
    document.body.classList.add("modo-claro");
    if (btnTema) btnTema.textContent = "🌙";
  }

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      document.body.classList.toggle("modo-claro");
      const claro = document.body.classList.contains("modo-claro");
      localStorage.setItem("tema", claro ? "claro" : "escuro");
      btnTema.textContent = claro ? "🌙" : "☀️";
    });
  }
});

const botaoLogin = document.getElementById("botao-login");

const usuarioLogado = localStorage.getItem("usuario");

if (usuarioLogado) {

    const usuario = JSON.parse(usuarioLogado);
    const botaoMeusAnuncios = document.getElementById("botao-meusanuncios");
    botaoMeusAnuncios.hidden = false;
    botaoMeusAnuncios.onclick = () => {
        window.location.href = "meusanuncios.html";
    };

    botaoLogin.textContent = `Olá, ${usuario.nome}`;

    botaoLogin.onclick = () => {

        localStorage.removeItem("usuario");

        window.location.reload();

    };

} else {

    botaoLogin.onclick = () => {

        window.location.href = "login.html";

    };

}
carregarLivros();



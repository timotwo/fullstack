let todosOsLivros = [];

const lista = document.getElementById("lista-livros");
const campoBusca = document.getElementById("campo-busca");
const botaoBusca = document.getElementById("botao-busca");



async function carregarLivros() {

    try {

        const resposta = await fetch("/livros");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar livros");
        }

        todosOsLivros = await resposta.json();

        mostrarLivros(todosOsLivros);

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
                        : `<span>aaaaaaaa</span>`
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
                    ${livro.usuario.cidade || "Cidade não informada"} -
                    ${livro.usuario.estado || ""}
                </p>

            </div>

        `;


        lista.appendChild(card);

    });
}



function buscarLivros() {

    const termo =
        campoBusca.value
            .trim()
            .toLowerCase();


    if (termo === "") {

        mostrarLivros(todosOsLivros);

        return;
    }


    const resultados =
        todosOsLivros.filter(livro => {

            const titulo =
                livro.titulo.toLowerCase();

            const autor =
                livro.autor.toLowerCase();


            return titulo.includes(termo)
                || autor.includes(termo);

        });


    mostrarLivros(resultados);
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



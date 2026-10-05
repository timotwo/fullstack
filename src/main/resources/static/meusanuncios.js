const lista = document.getElementById("lista-livros");

let usuario = null;


// cria um elemento com texto seguro (textContent não executa HTML)
function criar(tag, classe, texto) {

    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}


function formatarPreco(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}


function montarCard(livro) {

    const vendido = livro.vendido === true;

    const card = criar("div", "livro-card" + (vendido ? " vendido" : ""));


    // imagem (clicar leva para a página do livro)
    const areaImagem = criar("div", "livro-imagem");

    if (livro.imagem) {

        const img = document.createElement("img");
        img.src = livro.imagem;
        img.alt = livro.titulo;

        areaImagem.appendChild(img);

    } else {

        areaImagem.appendChild(criar("span", "", "Sem imagem"));
    }

    if (vendido) {
        areaImagem.appendChild(criar("span", "selo-vendido", "Vendido"));
    }

    areaImagem.addEventListener("click", () => {
        window.location.href = `livro.html?id=${livro.id}`;
    });


    // informações
    const info = criar("div", "livro-info");

    info.appendChild(criar("h3", "", livro.titulo));
    info.appendChild(criar("p", "autor", livro.autor));
    info.appendChild(criar("p", "preco", formatarPreco(livro.preco)));
    info.appendChild(
        criar("p", "conservacao", livro.estadoConservacao || "Não informado")
    );


    
    const acoes = criar("div", "livro-acoes");

    

    const botaoVendido = criar(
        "button",
        "btn-secundario",
        vendido ? "Reativar" : "Marcar vendido"
    );
    botaoVendido.addEventListener("click", () => alternarVendido(livro));

    const botaoExcluir = criar("button", "btn-perigo", "Excluir");
    botaoExcluir.addEventListener("click", () => excluir(livro));

    acoes.append( botaoVendido, botaoExcluir);
    info.appendChild(acoes);


    card.append(areaImagem, info);

    return card;
}


async function alternarVendido(livro) {

    try {

        const resposta = await fetch(
            `/livros/${livro.id}/vendido?usuarioId=${usuario.id}`,
            { method: "PATCH" }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar anúncio");
        }

        carregarAnuncios();

    } catch (erro) {

        console.error(erro);
        alert("Não foi possível atualizar o anúncio.");
    }
}


async function excluir(livro) {

    const confirmou = confirm(
        `Excluir o anúncio "${livro.titulo}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmou) {
        return;
    }

    try {

        const resposta = await fetch(
            `/livros/${livro.id}?usuarioId=${usuario.id}`,
            { method: "DELETE" }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao excluir anúncio");
        }

        carregarAnuncios();

    } catch (erro) {

        console.error(erro);
        alert("Não foi possível excluir o anúncio.");
    }
}


async function carregarAnuncios() {

    try {

        const resposta = await fetch(`/livros/usuario/${usuario.id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar anúncios");
        }

        const livros = await resposta.json();

        lista.replaceChildren();

        if (livros.length === 0) {

            lista.appendChild(
                criar("p", "", "Você ainda não anunciou nenhum livro.")
            );

            return;
        }

        // mais novos primeiro
        livros.sort((a, b) => b.id - a.id);

        livros.forEach(livro => lista.appendChild(montarCard(livro)));

    } catch (erro) {

        console.error(erro);

        lista.replaceChildren(
            criar("p", "", "Não foi possível carregar seus anúncios.")
        );
    }
}


function iniciar() {

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
        window.location.href = "login.html";
        return;
    }

    usuario = JSON.parse(usuarioSalvo);

    carregarAnuncios();
}

iniciar();
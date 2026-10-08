async function carregarLivro() {

    const detalhes = document.getElementById("detalhes-livro");

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!id) {
        detalhes.innerHTML = "<p>Livro não encontrado.</p>";
        return;
    }

    try {

        const resposta = await fetch(`/livros/${id}`);

        if (!resposta.ok) {
            throw new Error("Livro não encontrado");
        }

        const livro = await resposta.json();

        detalhes.innerHTML = `
            <div class="livro-detalhe">

                <div class="livro-detalhe-imagem">
                    ${
                        livro.imagem
                            ? `<img src="${livro.imagem}" alt="${livro.titulo}">`
                            : `<span>upar imagem</span>`
                    }
                </div>

                <div class="livro-detalhe-info">

                    <p class="categoria">Livro usado</p>

                    <h2>${livro.titulo}</h2>

                    <p class="autor">
                        ${livro.autor}
                    </p>

                    <p class="preco">
                        R$ ${Number(livro.preco).toFixed(2).replace(".", ",")}
                    </p>

                    <p>
                        <strong>Estado de conservação:</strong>
                        ${livro.estadoConservacao || "Não informado"}
                    </p>

                    <div class="descricao">

                        <h3>Descrição</h3>

                        <p>
                            ${livro.descricao || "sem descrição."}
                        </p>

                    </div>
                    <div class="vendedor">
                        <h3>Vendedor</h3>

                        <p>
                            <strong>${livro.usuario.nome}</strong>
                        </p>

                        <p>
                            ${livro.usuario.cidade || "Cidade não informada"} -
                            ${livro.usuario.estado || ""}
                        </p>
                    </div>

                    <button
                        class="btn-principal btn-interesse"
                        id="botao-interesse"
                    >
                        Tenho interesse
                    </button>

                </div>

            </div>
        `;
        const botaoInteresse = document.getElementById("botao-interesse");

        botaoInteresse.addEventListener("click", () => {

            const telefone = livro.usuario.telefone;

            if (!telefone) {
                alert("O vendedor não informou um whatsapp.");
                return;
            }

            const numero = telefone.replace(/\D/g, "");

            const mensagem =
                `Ola, tenho interesse no livro "${livro.titulo}", ele ainda esta disponivel?`;

            const url =
                `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");
        });

    } catch (erro) {

        console.error(erro);

        detalhes.innerHTML = `
            <p>Não foi possível carregar esse livro.</p>
        `;
    }
}

carregarLivro();
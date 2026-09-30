
const formulario = document.getElementById("form-anuncio");
const mensagem = document.getElementById("mensagem");
const selectCategoria = document.getElementById("categoria");


// Carrega as categorias do banco
async function carregarCategorias() {

    try {

        const resposta = await fetch("/categorias");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar categorias.");
        }

        const categorias = await resposta.json();

        selectCategoria.innerHTML = '<option value="">Selecione</option>';

        categorias.forEach(categoria => {

            const opcao = document.createElement("option");

            opcao.value = categoria.id;
            opcao.textContent = categoria.nome;

            selectCategoria.appendChild(opcao);
        });

    } catch (erro) {

        console.error(erro);

        selectCategoria.innerHTML =
            '<option value="">Erro ao carregar categorias</option>';
    }
}


// Publica o livro
formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {

        mensagem.textContent =
            "Você precisa estar logado para anunciar um livro.";

        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    const livro = {

        titulo: document.getElementById("titulo").value,

        autor: document.getElementById("autor").value,

        descricao: document.getElementById("descricao").value,

        preco: Number(document.getElementById("preco").value),

        estadoConservacao:
            document.getElementById("estadoConservacao").value,

        imagem:
            document.getElementById("imagem").value,

        usuario: {
            id: usuario.id
        },

        categoria: {
            id: Number(selectCategoria.value)
        }
    };


    try {

        const resposta = await fetch("/livros", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(livro)
        });


        if (!resposta.ok) {
            throw new Error("Não foi possível publicar o livro.");
        }


        const livroCriado = await resposta.json();

        console.log("Livro publicado:", livroCriado);


        mensagem.textContent =
            "Livro publicado com sucesso!";


        formulario.reset();


        setTimeout(() => {
            window.location.href = "/";
        }, 1000);


    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Erro ao publicar o livro.";
    }

});


carregarCategorias();


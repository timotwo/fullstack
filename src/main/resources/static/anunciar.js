const formulario = document.getElementById("form-anuncio");
const mensagem = document.getElementById("mensagem");
const selectCategoria = document.getElementById("categoria");
const campoImagem = document.getElementById("imagem");
const previa = document.getElementById("previa");

const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];


function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.className = erro ? "erro" : "";
}


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


campoImagem.addEventListener("change", () => {

    const arquivo = campoImagem.files[0];

    previa.style.display = "none";
    mensagem.textContent = "";

    if (!arquivo) {
        return;
    }

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        mostrarMensagem("Use uma imagem JPG, PNG ou WebP.", true);
        campoImagem.value = "";
        return;
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
        mostrarMensagem("A imagem deve ter no máximo 5 MB.", true);
        campoImagem.value = "";
        return;
    }

    previa.src = URL.createObjectURL(arquivo);
    previa.style.display = "block";
});


formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {

        mostrarMensagem(
            "Você precisa estar logado para anunciar um livro.",
            true
        );

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

        usuario: {
            id: usuario.id
        },

        categoria: {
            id: Number(selectCategoria.value)
        }
    };

    const dados = new FormData();

    dados.append(
        "livro",
        new Blob([JSON.stringify(livro)], { type: "application/json" })
    );

    const arquivo = campoImagem.files[0];

    if (arquivo) {
        dados.append("imagem", arquivo);
    }

    try {

        
        const resposta = await fetch("/livros", {

            method: "POST",

            body: dados
        });


        if (!resposta.ok) {
            throw new Error("Não foi possível publicar o livro.");
        }


        const livroCriado = await resposta.json();

        console.log("Livro publicado:", livroCriado);


        mostrarMensagem("Livro publicado com sucesso");


        formulario.reset();
        previa.style.display = "none";


        setTimeout(() => {
            window.location.href = "/";
        }, 1000);


    } catch (erro) {

        console.error(erro);

        mostrarMensagem("Erro ao publicar o livro.", true);
    }

});


carregarCategorias();
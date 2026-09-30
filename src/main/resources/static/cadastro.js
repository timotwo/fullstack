const formulario = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const usuario = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        telefone: document.getElementById("telefone").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value.toUpperCase()
    };

    try {

        const resposta = await fetch("/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível criar a conta");
        }

        const usuarioCriado = await resposta.json();

        console.log("Usuário criado:", usuarioCriado);

        mensagem.textContent = "Conta criada com sucesso";

        formulario.reset();

    } catch (erro) {

        console.error(erro);

        mensagem.textContent = "Erro ao criar a conta";
    }
});


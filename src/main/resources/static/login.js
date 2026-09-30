const formulario = document.getElementById("form-login");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch("/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        if (!resposta.ok) {
            throw new Error("E-mail ou senha incorretos");
        }

        const usuario = await resposta.json();

       
        localStorage.setItem("usuario", JSON.stringify(usuario));

        mensagem.textContent = "Login realizado com sucesso";

        
        setTimeout(() => {
            window.location.href = "/";
        }, 500);

    } catch (erro) {

        console.error(erro);

        mensagem.textContent = erro.message;
    }
});


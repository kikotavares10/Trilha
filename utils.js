const forfeitButton = document.getElementById('forfeit-button');

export class Utils {
    static mostrarMensagem(mensagem) {
        const mensagemElement = document.getElementById("mensagem");

        if (mensagemElement) {
            // Define a mensagem e torna visível
            mensagemElement.innerText = mensagem;
            mensagemElement.classList.add("mensagem");
            mensagemElement.classList.remove("mensagem-oculta");
        } else {
            console.error("Elemento 'mensagem' não encontrado.");
        }
    }

    static ocultarMensagem() {
        const mensagemElement = document.getElementById("mensagem");

        if (mensagemElement) {
            mensagemElement.classList.add("mensagem-oculta");
            setTimeout(() => {
                mensagemElement.classList.remove("mensagem-visivel");
            }, 300); 
        }
    }
}

forfeitButton.addEventListener('click', (event) => {
    event.preventDefault();
    Utils.ocultarMensagem(); 
});


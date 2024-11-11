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

    // Função para exibir a mensagem temporária por 4 segundos
    static mostrarMensagemTemporaria(mensagem) {
        const mensagemTemporariaElement = document.getElementById("mensagem-temporaria");

        if (mensagemTemporariaElement) {
            mensagemTemporariaElement.innerText = mensagem;
            mensagemTemporariaElement.classList.add("mensagem-visivel");
            mensagemTemporariaElement.classList.remove("mensagem-oculta");

            // Oculta a mensagem após 4 segundos
            setTimeout(() => {
                mensagemTemporariaElement.classList.add("mensagem-oculta");
                mensagemTemporariaElement.classList.remove("mensagem-visivel");
            }, 4000);
        } else {
            console.error("Elemento 'mensagem-temporaria' não encontrado.");
        }
    }

}

forfeitButton.addEventListener('click', (event) => {
    event.preventDefault();
    Utils.ocultarMensagem(); 
});


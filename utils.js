export class Utils {
    static mostrarMensagem(mensagem) {
        const mensagemElement = document.getElementById("mensagem");
        if (mensagemElement) { // Verifica se o elemento existe
            mensagemElement.innerText = mensagem;
        } else {
            console.error("Elemento 'mensagem' não encontrado.");
        }
    }
}

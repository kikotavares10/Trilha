export class Jogador {
    constructor(id) {
        this.id = id;              // ID do jogador (1 ou 2)
        this.pecas = 0;            // Número de peças colocadas no tabuleiro
    }

    adicionarPeca() {
        this.pecas++;
    }

    removerPeca() {
        if (this.pecas > 0) {
            this.pecas--;
        }
    }
}
export class Jogador {
    constructor(id) {
        this.id = id;              // ID do jogador (1 ou 2)
        this.pecas = 0;            // Número de peças colocadas no tabuleiro
        this.pecasRemovidas = 0;
        this.vitorias = 0;
    }

    adicionarPeca() {
        this.pecas++;
    }

    removerPeca() {
        if (this.pecas > 0) {
            this.pecas--;
        }
    }
    
    adicionarVitoria() {
        this.vitorias++;
    }
}



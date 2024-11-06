const readline = require('readline');

class Jogador {
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

class Tabuleiro {
    constructor() {
        this.forma = [
            ['1', '0', '0', '1', '0', '0', '1'],
            ['0', '1', '0', '1', '0', '1', '0'],
            ['0', '0', '1', '1', '1', '0', '0'],
            ['1', '1', '1', '4', '1', '1', '1'],
            ['0', '0', '1', '1', '1', '0', '0'],
            ['0', '1', '0', '1', '0', '1', '0'],
            ['1', '0', '0', '1', '0', '0', '1']
        ];

        this.conexoes = {
            // Quadrado externo
            '0,0': ['0,3', '3,0','1,1'],      
            '0,3': ['0,0', '0,6', '1,3'], 
            '0,6': ['0,3', '3,6','1,5'],
            '3,0': ['0,0', '6,0', '3,1'],
            '3,6': ['0,6', '6,6', '3,5'],
            '6,0': ['3,0', '6,3','5,1'],
            '6,3': ['6,0', '6,6', '5,3'],
            '6,6': ['3,6', '6,3','5,5'],
        
            // Quadrado médio
            '1,1': ['1,3', '3,1','0,0','2,2'],
            '1,3': ['0,3', '1,1', '1,5', '2,3'], 
            '1,5': ['1,3', '3,5','0,6','2,4'],
            '3,1': ['1,1', '5,1', '3,0'],
            '3,5': ['1,5', '5,5', '3,6'],
            '5,1': ['3,1', '5,3','6,0','4,2'],
            '5,3': ['6,3', '5,1', '5,5'],
            '5,5': ['3,5', '5,3','6,6','4,4'],
        
            // Quadrado interno
            '2,2': ['2,3', '3,2','1,1'],
            '2,3': ['1,3', '2,2', '2,4'],
            '2,4': ['2,3', '3,4','1,5'],
            '3,2': ['2,2', '3,1', '4,2'],
            '3,4': ['2,4', '3,5', '4,4'],
            '4,2': ['3,2', '4,3','5,1'], 
            '4,3': ['4,2','4,4','5,4'],
            '4,4': ['4,3','3,4','5,5']
        };

        this.jogadas=1;
    }

    imprimir() {
        for (let linha of this.forma) {
            console.log(linha.join(' '));
        }
    }

    jogadaValida(linha, coluna) {
        return linha >= 0 && linha < this.forma.length && coluna >= 0 && coluna < this.forma[0].length && this.forma[linha][coluna] === '1';
    }

    colocarPeca(linha, coluna, jogadorId) {
        if (this.jogadaValida(linha, coluna)) {
            this.forma[linha][coluna] = jogadorId.toString();
            return true;
        } else {
            return false;
        }
    }

    removerPeca(linha, coluna) {
        this.forma[linha][coluna] = '1'; // Volta a ser um espaço disponível
    }

    moverPeca(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino, jogadorId) {
        if (this.forma[linhaOrigem][colunaOrigem] === jogadorId.toString() && this.jogadaValida(linhaDestino, colunaDestino)) {
            // Remove peça da origem e move para o destino
            this.forma[linhaOrigem][colunaOrigem] = '1';
            this.forma[linhaDestino][colunaDestino] = jogadorId.toString();
            return true;
        }
        return false;
    }

    // Verificar se uma casa está conectada a outra
    posicoesAdjacentes(linha, coluna) {
        const posicoes = [];
        const posAtual = `${linha},${coluna}`;

        if (this.conexoes[posAtual]) {
            for (let adj of this.conexoes[posAtual]) {
                const [adjLinha, adjColuna] = adj.split(',').map(Number);
                if (this.jogadaValida(adjLinha, adjColuna)) {
                    posicoes.push([adjLinha, adjColuna]);
                }
            }
        }

        return posicoes;
    }
}

class Moinho {
    constructor() {
        this.moinhos = [];  // Lista de moinhos, cada moinho é um array de 3 posições
    }

    adicionarMoinho(posicoes) {
        // Adiciona um novo moinho se tiver exatamente 3 posições
        if (posicoes.length === 3) {
            this.moinhos.push(posicoes);
        }
    }

    estaEmMoinho(posicao) {
        // Verifica se a posição está em algum moinho
        for (const moinho of this.moinhos) {
            if (moinho.includes(posicao)) {
                return true;
            }
        }
        return false;
    }

    todosEmMoinho(pecasDoJogador) {
        // Verifica se todas as peças do jogador estão em moinhos
        for (const peca of pecasDoJogador) {
            if (!this.estaEmMoinho(peca)) {
                return false;
            }
        }
        return true;
    }
}

let jogador1 = new Jogador(2);
let jogador2 = new Jogador(3);
let turno = 1;  // Alterna entre os jogadores

let tabuleiro = new Tabuleiro();

// Cria a interface readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Função para verificar se um jogador formou uma trilha
function verificarTrilha(jogador,linha,coluna) {  
    const jogadorAtual = (jogador === jogador1.id) ? jogador1.id : jogador2.id;
    const jogador_atual_Str = jogadorAtual.toString();
    const jogadorAdversario = (jogador === jogador1.id) ? jogador2.id : jogador1.id;
    const jogador_adversario_Str = jogadorAdversario.toString();

    count = 1;

    // Verificar coluna para baixo
    for (let i = linha+1; i<7; i++) {
        if (tabuleiro.forma[i][coluna] === jogador_atual_Str) {
            count++;
        }
        else if ( (tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (tabuleiro.forma[i][coluna] === "4") ) {
            break;
        } 
    }

    //Verificar coluna para cima
    for (let i = linha-1; i>=0; i--) {
        if (tabuleiro.forma[i][coluna] === jogador_atual_Str) {
            count++;
        }
        else if ( (tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (tabuleiro.forma[i][coluna] === "4") ) {
            break;
        } 
    }

    //Verifica se tem moinhos na coluna
    if (count === 3){
        return true;
    }
    else{
        count=1;
    }

    //Verificar linha para direita
    for (let i = coluna+1; i<7; i++) {
        if (tabuleiro.forma[linha][i] === jogador_atual_Str) {
            count++;
        }
        else if ( (tabuleiro.forma[linha][i] === jogador_adversario_Str) || (tabuleiro.forma[linha][i] === "4") ) {
            break;
        } 
    }

    //Verifica linha esquerda
    for (let i = coluna-1; i>=0; i--) {
        if (tabuleiro.forma[linha][i] === jogador_atual_Str) {
            count++;
        }
        else if ( (tabuleiro.forma[linha][i] === jogador_adversario_Str) || (tabuleiro.forma[linha][i] === "4") ) {
            break;
        } 
    }
    if (count === 3) {
        return true;
    }

return false;

}

//Aqui faz a jogada
function fazerJogada(linha, coluna, jogador) {
    if (tabuleiro.colocarPeca(linha, coluna, jogador.id)) {
        jogador.adicionarPeca();
        return true;
    } else {
        console.log('Jogada inválida. Tente novamente.');
        return false;
    }
}


// Função para remover peça do adversário
function removerPecaAdversaria(jogador) {
    const jogadorAdversario = (jogador === jogador1) ? jogador2 : jogador1;

    rl.question('Escolha a linha da peça do adversário a ser removida (1-7): ', (linhaInput) => {
        const linha = parseInt(linhaInput, 10) - 1;

        rl.question('Escolha a coluna da peça do adversário a ser removida (1-7): ', (colunaInput) => {
            const coluna = parseInt(colunaInput, 10) - 1;

            //console.group(`Linha: ${linha}`)
            //console.group(`Coluna: ${coluna}`)
            //console.group(`id: ${jogadorAdversario.id}`)

            if (tabuleiro.forma[linha][coluna] === jogadorAdversario.id.toString()) {
                tabuleiro.removerPeca(linha, coluna);
                console.log(`Peça do Jogador ${jogadorAdversario.id} removida.`);
                turno = turno === 1 ? 2 : 1;
                pedirJogada();
            } else {
                console.log('Escolha inválida. Tente novamente.');
                removerPecaAdversaria(jogador); 
            }
        });
    });
}


// Função para pedir jogada na fase de movimentação
function pedirMovimento() {
    const jogadorAtual = turno === 1 ? jogador1 : jogador2;
    console.log(`\nJogador ${turno}, mova uma de suas peças!`);
    moverPeca(jogadorAtual);
}


// Função que pede input do jogador e continua o jogo
function pedirJogada() {
    tabuleiro.imprimir();  // Agora usamos o método da classe Tabuleiro para imprimir

    const jogadorAtual = turno === 1 ? jogador1 : jogador2;
    console.log(`\nJogador ${turno}, é a sua vez!`);

    if (tabuleiro.jogadas <= 18) {
        rl.question('Escolha a linha (1-7) para colocar a peça: ', (linhaInput) => {
            const linha = parseInt(linhaInput, 10) - 1;

            rl.question('Escolha a coluna (1-7) para colocar a peça: ', (colunaInput) => {
                const coluna = parseInt(colunaInput, 10) - 1;

                if (tabuleiro.colocarPeca(linha, coluna, jogadorAtual.id)) {
                    tabuleiro.jogadas++;
                    if (verificarTrilha(jogadorAtual.id, linha, coluna)) {
                        console.log(`Jogador ${turno} formou uma trilha!`);
                        removerPecaAdversaria(jogadorAtual);
                    } else {
                        turno = turno === 1 ? 2 : 1;  // Alterna o turno
                        pedirJogada();
                    }
                } else {
                    console.log('Posição inválida. Tente novamente.');
                    pedirJogada();
                }
            });
        });
    } else {
        console.log('Todos os jogadores já colocaram suas peças. Agora mova suas peças.');
        moverPeca(jogadorAtual); // Inicia a fase de movimentação
    }
}

// Função para mover uma peça
function moverPeca(jogador) {
    rl.question('Escolha a linha da peça que deseja mover (1-7): ', (linhaInput) => {
        const linha = parseInt(linhaInput, 10) - 1;

        rl.question('Escolha a coluna da peça que deseja mover (1-7): ', (colunaInput) => {
            const coluna = parseInt(colunaInput, 10) - 1;

            if (tabuleiro.forma[linha][coluna] === jogador.id.toString()) {
                const adjacentes = tabuleiro.posicoesAdjacentes(linha, coluna);

                if (adjacentes.length > 0) {
                    console.log('Posições adjacentes disponíveis:');
                    adjacentes.forEach((pos, index) => {
                        console.log(`${index + 1}: [${pos[0] + 1}, ${pos[1] + 1}]`);
                    });

                    rl.question('Escolha a posição para mover (escolha o número correspondente): ', (posicaoInput) => {
                        const posicaoEscolhida = parseInt(posicaoInput, 10) - 1;
                        const [novaLinha, novaColuna] = adjacentes[posicaoEscolhida];

                        // Mover a peça
                        tabuleiro.removerPeca(linha, coluna);
                        tabuleiro.colocarPeca(novaLinha, novaColuna, jogador.id);
                        console.log(`Peça movida para [${novaLinha + 1}, ${novaColuna + 1}]`);

                        turno = turno === 1 ? 2 : 1;
                        pedirJogada();
                    });
                } else {
                    console.log('Não há posições adjacentes disponíveis para mover. Tente novamente.');
                    moverPeca(jogador);
                }
            } else {
                console.log('Você não tem uma peça nessa posição. Tente novamente.');
                moverPeca(jogador);
            }
        });
    });
}



// Função para iniciar o jogo
function iniciarJogo() {
    console.log("Bem-vindo ao Jogo Trilha!");
    pedirJogada();
}

// Chama a função para iniciar o jogo
iniciarJogo();


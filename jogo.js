import { Utils } from './utils.js';
import { Jogador } from './jogador.js';
import { Tabuleiro } from './tabuleiro.js';

export class Jogo {
    constructor(jogador1, jogador2, tabuleiro) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.tabuleiro = tabuleiro;
        this.turno = 2; // 2 para jogador1, 3 para jogador2
        this.jogadas = 0; // Contador de jogadas para mudar de fase
        this.winner = false;
        this.fase = 1;
    }  

    // Função para verificar se um jogador formou uma trilha
    verificarTrilha(linha,coluna) {  
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;
        const jogador_adversario_Str = jogadorAdversario.toString();

        let count = 1;

        // console.log("Entrou na trilha")

        // console.log(`Truno: ${this.turno}`)

        // Verificar coluna para baixo
        for (let i = linha+1; i<this.tabuleiro.tamanho; i++) {
            if (this.tabuleiro.forma[i][coluna] === this.turno.toString()) {
                count++;
            }
            else if ( (this.tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (this.tabuleiro.forma[i][coluna] === "4") || (this.tabuleiro.forma[i][coluna] === "1") ) {
                break;
            } 
        }

        // console.log(`Count: ${count}`)

        //Verificar coluna para cima
        for (let i = linha-1; i>=0; i--) {
            if (this.tabuleiro.forma[i][coluna] === this.turno.toString()) {
                count++;
            }
            else if ( (this.tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (this.tabuleiro.forma[i][coluna] === "4") || (this.tabuleiro.forma[i][coluna] === "1") ) {
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
        for (let i = coluna+1; i<this.tabuleiro.tamanho; i++) {
            if (this.tabuleiro.forma[linha][i] === this.turno.toString()) {
                count++;
            }
            else if ( (this.tabuleiro.forma[linha][i] === jogador_adversario_Str) || (this.tabuleiro.forma[linha][i] === "4") || (this.tabuleiro.forma[linha][i] === "1") ) {
                break;
            } 
        }

        //Verifica linha esquerda
        for (let i = coluna-1; i>=0; i--) {
            if (this.tabuleiro.forma[linha][i] === this.turno.toString()) {
                count++;
            }
            else if ( (this.tabuleiro.forma[linha][i] === jogador_adversario_Str) || (this.tabuleiro.forma[linha][i] === "4") || (this.tabuleiro.forma[linha][i] === "1") ) {
                break;
            } 
        }
        if (count === 3) {
            return true;
        }

    return false;

    }

    // Função para remover peça do adversário
    async removerPecaAdversaria(linha,coluna) {
        Utils.mostrarMensagem("Escolha a posição para remover uma peça do adversário.");
    
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;
        const jogador_adversario_Str = jogadorAdversario.toString();
    
        let posicaoValida = false;
    
        // while (!posicaoValida) {
        //     // Aguardar entrada do usuário para linha e coluna
        //     await new Promise((resolve) => {
        //         document.getElementById("confirmar-jogada").onclick = () => {
        //             linha = parseInt(document.getElementById("linha").value, 10) - 1;
        //             coluna = parseInt(document.getElementById("coluna").value, 10) - 1;
        //             resolve(); // Resolva a promessa após o clique no botão
        //         };
        //     });
    
        //     if (this.tabuleiro.forma[linha][coluna] === jogador_adversario_Str) {
        //         posicaoValida = true; // Se a posição for válida, saia do loop
        //     } else if (this.tabuleiro.forma[linha][coluna] === this.turno) {
        //         Utils.mostrarMensagem(`Não pode remover uma peça sua jogador ${this.turno}`);
        //     } else {
        //         Utils.mostrarMensagem(`Jogada inválida. Tente novamente jogador ${this.turno}`);
        //     }
        // }
    
        // Após obter uma posição válida
        this.tabuleiro.removerPeca(linha, coluna);
    
        if (this.turno === 2) {
            this.jogador2.pecas--;
        } else {
            this.jogador1.pecas--;
        }
    
        Utils.mostrarMensagem(`Peça do Jogador ${jogadorAdversario} removida.`);
    }
    

    // Função para a fase 1: Colocação das peças
    async fase1(linha,coluna) {

        // console.log(`Tabuleiro antes de qualquer jogada ${this.tabuleiro.forma}`)

        // this.tabuleiro.imprimir(this.turno);

        if (this.tabuleiro.colocarPeca(linha, coluna, this.turno)) {
            
            if (this.turno === 2){
                this.jogador1.pecas++;
            }
            else{
                this.jogador2.pecas++;
            }

            //console.log(`Tabuleiro depois da jogada ${this.tabuleiro.forma}`)
            this.tabuleiro.imprimir(this.turno);

            if (this.verificarTrilha(linha, coluna)) {
                Utils.mostrarMensagem(`Jogador ${this.turno} formou uma trilha!`);
                console.log("Formou a trilha")
                const { x: i, y: j } = await aguardarClique();
                this.removerPecaAdversaria(i,j);
                //console.log(`Tabuleiro depois de remover a peça ${this.tabuleiro.forma}`);
                this.tabuleiro.imprimir(this.turno);

            } 
            
        }
    }

    async fase2(linha,coluna,linha2,coluna2) {
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        // Executar o movimento
        this.tabuleiro.moverPeca(linha, coluna, linha2, coluna2, this.turno);
        this.tabuleiro.imprimir(this.turno);
    
        if (this.verificarTrilha(linha2, coluna2)) {
            // console.log("Trilha verdadeira")
            Utils.mostrarMensagem(`Jogador ${this.turno} formou uma trilha!`);
            const { x: i, y: j } = await aguardarClique();
            this.removerPecaAdversaria(i,j);
            //console.log(`Tabuleiro depois de remover a peça ${this.tabuleiro.forma}`);
            this.tabuleiro.imprimir(this.turno);
        }
    }

    receberCoordenadasfase1(linha,coluna){

        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        // console.log(`Linha: ${linha}`)
        // console.log(`Coluna: ${coluna}`)

        if (this.tabuleiro.forma[linha][coluna] === jogadorAdversario.toString()) {
            console.log(`Posição já ocupada por peça do jogador ${jogadorAdversario}`)
            return false;
        }
        
        else if (!this.tabuleiro.jogadaValida(linha, coluna)) {
            console.log(`Jogada inválida. Tente novamente ${this.jogo.turno}`)
            return false;
        }

        return true;

    }

    receberCoordenadasfase2(linha,coluna,linha2,coluna2){

        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        // console.log(`Linha: ${linha}`)
        // console.log(`Coluna: ${coluna}`)
        // console.log(`Linha: ${linha2}`)
        // console.log(`Coluna: ${coluna2}`)

        if (this.tabuleiro.forma[linha][coluna] === jogadorAdversario.toString()) {
            console.log(`Peça pertence ao jogador adversário ${jogadorAdversario}`)
            return false;
        }

        else if (this.tabuleiro.forma[linha][coluna] != this.turno){
            console.log(`Peça não encontrada na posição ${linha} ${coluna}`)
            return false;
        }

        else if (!this.tabuleiro.movimentoValido(linha, coluna, linha2, coluna2, this.turno)){
            return false;
        }
        
        return true;

    }
    
    gameOver(){
        if (this.jogador1.pecas <= 2){
            Utils.mostrarMensagem("O jogador 3 ganhou")
            this.winner=true;
        }

        else if (this.jogador2.pecas <= 2){
            Utils.mostrarMensagem("O jogador 2 ganhou")
            this.winner=true;
        }
    }
}


// Função para iniciar o jogo
async function iniciarJogo() {
    console.log("Função iniciarJogo chamada");
    Utils.mostrarMensagem("Bem-vindo ao Jogo Trilha!");
    // console.log("Descambou");
    let jogador1 = new Jogador(2);
    let jogador2 = new Jogador(3);
    let tabuleiro = new Tabuleiro();

    const jogo = new Jogo(jogador1, jogador2, tabuleiro);

    jogo.tabuleiro.imprimir(jogo.turno); // Exibe o tabuleiro após o início

    // console.log("Descambou ainda mais");

    await aguardarJogada(jogo);
}

async function aguardarJogada(jogo) {
    let i, j, k, l; // Variáveis para coordenadas dos cliques

    // Laço para continuar até que o jogo tenha um vencedor
    while (!jogo.winner) {

        // Atualiza a fase do jogo conforme o número de jogadas
        if (jogo.fase === 1 && jogo.tabuleiro.jogadas > 8) {
            jogo.fase = 2;
        }

        if (jogo.fase === 2){
            jogo.gameOver();
            console.log(`Acabou e o winner esta a ${jogo.winner}`)
            if (jogo.winner) break; // Sai do loop se o jogo acabou
        }

        Utils.mostrarMensagem(`O jogador ${jogo.turno} faça o seu movimento para a fase ${jogo.fase}`);
        console.log(`A fase do jogo é ${jogo.fase}`);

        // console.log(`Tabuleiro atual: ${jogo.tabuleiro.forma}`)

        // Passo 1: Aguarda o primeiro clique
        const { x: i, y: j } = await aguardarClique();

        if (jogo.fase === 1) {
            // Fase 1: Executa a jogada se for possível
            if (jogo.receberCoordenadasfase1(i, j)) {
                console.log("Executa ação para fase 1");
                await jogo.fase1(i, j);
                console.log("Jogada válida na fase 1!");
                // Alternar turno
                jogo.tabuleiro.jogadas++;
                jogo.turno = jogo.turno === 2 ? 3 : 2;
            } else {
                console.log("Jogada inválida na fase 1!");
            }
            // console.log(`Tabuleiro atual: ${jogo.tabuleiro.forma}`)

        } else if (jogo.fase === 2) {

            // Fase 2: Aguarda o segundo clique
            const { x: k, y: l } = await aguardarClique();

            // Verifica se a jogada com dois cliques é válida
            if (jogo.receberCoordenadasfase2(i, j, k, l)) {
                // Executa ação para fase 2
                await jogo.fase2(i, j, k, l);
                console.log("Jogada válida na fase 2!");
                // Alternar turno
                jogo.tabuleiro.jogadas++;
                jogo.turno = jogo.turno === 2 ? 3 : 2;
            } else {
                console.log("Jogada inválida na fase 2!");
            }
        }

    }
}

// Função auxiliar para aguardar um clique e retornar as coordenadas
function aguardarClique() {
    return new Promise((resolve) => {
        document.addEventListener("jogadaClicada", function handler(event) {
            const { i, j } = event.detail; // Captura as coordenadas do clique
            document.removeEventListener("jogadaClicada", handler); // Remove o evento
            resolve({ x: i, y: j }); // Retorna as coordenadas
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play-button").addEventListener("click", async () => {
        await iniciarJogo(); // Inicia o jogo
    });
});

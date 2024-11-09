import { Utils } from './utils.js';
import { Jogador } from './jogador.js';
import { Tabuleiro } from './tabuleiro.js';

// console.log("Script carregado");

export class Jogo {
    constructor(jogador1, jogador2, tabuleiro) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.tabuleiro = tabuleiro;
        this.turno = 2; // 2 para jogador1, 3 para jogador2
        this.jogadas = 0; // Contador de jogadas para mudar de fase
        this.winner = false;
        this.fase = 1;
        this.turnocomp = 0;

        if (this.jogador1.id === 4){
            this.isComputerTurn = true;
            this.turnocomp = 2;
            this.jogador1.id = 2;
        } else if  (this.jogador2.id === 4){
            this.isComputerTurn = false;
            this.turnocomp = 3;
            this.jogador2.id = 3;
        }

        this.jogadasFinais = 0;
    }  

    alternarTurno() {
        this.turno = this.turno === 2 ? 3 : 2;
        if (this.turnocomp === 3){
            this.isComputerTurn = this.turno === 3;
        } else if (this.turnocomp === 2){
            this.isComputerTurn = this.turno === 2;
        }
    }

    atualizarPecasDosJogadores() {
        const pecasJogadorAzul = document.getElementById('pecas-jogador-azul');
        const pecasJogadorVermelho = document.getElementById('pecas-jogador-vermelho');
    
        // Limpa o conteúdo atual dos contêineres
        pecasJogadorAzul.innerHTML = '';
        pecasJogadorVermelho.innerHTML = '';

        console.log(`Peças do jogador1: ${this.jogador1.pecas}`)
        console.log(`Peças do jogador2: ${this.jogador2.pecas}`)
    
        // Adiciona as peças do jogador azul
        for (let i = 0; i < (3 * this.tabuleiro.quadrados - this.jogador1.pecas- this.jogador1.pecasRemovidas); i++) {
            const pecaAzul = document.createElement('div');
            pecaAzul.classList.add('bola', 'bola-azul');
            pecasJogadorAzul.appendChild(pecaAzul);
        }
    
        // Adiciona as peças do jogador vermelho
        for (let i = 0; i < (3 * this.tabuleiro.quadrados - this.jogador2.pecas- this.jogador2.pecasRemovidas); i++) {
            const pecaVermelha = document.createElement('div');
            pecaVermelha.classList.add('bola', 'bola-vermelha');
            pecasJogadorVermelho.appendChild(pecaVermelha);
        }
    }

    atualizarPecasRemovidas(jogador) {
        const contRemovidasAzul = document.getElementById('pecas-removidas-azul');
        const contRemovidasVermelho = document.getElementById('pecas-removidas-vermelho');
    
        const pecaRemovida = document.createElement('div');
        pecaRemovida.classList.add('bola');
    
        if (jogador === 2) {
            // Jogador azul
            this.jogador1.pecasRemovidas++;
            pecaRemovida.classList.add('bola-azul');
            contRemovidasAzul.appendChild(pecaRemovida);
        } else if (jogador === 3) {
            // Jogador vermelho
            this.jogador2.pecasRemovidas++;
            pecaRemovida.classList.add('bola-vermelha');
            contRemovidasVermelho.appendChild(pecaRemovida);
        }
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
        if (count >= 3){
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
        if (count >= 3) {
            return true;
        }

    return false;

    }

    gerarFilhosfase1(){                 // Gera os filhos para a fase 1 (ver as casas disponiveis)
        const posicoes = [];
    
        for (let i = 0; i < this.tabuleiro.forma.length; i++) {
            for (let j = 0; j < this.tabuleiro.forma[i].length; j++) {
                if (this.tabuleiro.forma[i][j] === "1") {
                    posicoes.push({ x: i, y: j });
                }
            }
        }
    
        return posicoes;
    }

    gerarFilhosfase21(jogador){             // Gera os filhos para a fase 21 ou seja a fase de selecionar a peça
        const posicoes = [];
    
        for (let i = 0; i < this.tabuleiro.forma.length; i++) {
            for (let j = 0; j < this.tabuleiro.forma[i].length; j++) {
                if (this.tabuleiro.forma[i][j] === jogador.toString()) {
                    posicoes.push({ x: i, y: j });
                }
            }
        }
    
        return posicoes;
    }


    gerarFilhosfase22(linha,coluna){    // Gera os filhos para a fase 22 ou seja a fase de mover a peça

        const jogadorAdversario = (this.turno === 2) ? 3 : 2;
        const jogador_adversario_Str = jogadorAdversario.toString();

        let filhos = [];

        // Verificar coluna para baixo
        for (let i = linha+1; i<this.tabuleiro.tamanho; i++) {
            if (this.tabuleiro.forma[i][coluna] === "1") {
                filhos.push({ x: i, y: coluna });
                break;
            }
            else if ( (this.tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (this.tabuleiro.forma[i][coluna] === "4") || (this.tabuleiro.forma[i][coluna] === this.turno.toString()) ) {
                break; 
            } 
        }

        //Verificar coluna para cima
        for (let i = linha-1; i>=0; i--) {
            if (this.tabuleiro.forma[i][coluna] === "1") {
                filhos.push({ x: i, y: coluna });
                break;
            }
            else if ( (this.tabuleiro.forma[i][coluna] === jogador_adversario_Str) || (this.tabuleiro.forma[i][coluna] === "4") || (this.tabuleiro.forma[i][coluna] === this.turno.toString()) ) {
                break; 
            } 
        }

        //Verificar linha para direita
        for (let i = coluna+1; i<this.tabuleiro.tamanho; i++) {
            if (this.tabuleiro.forma[linha][i] === "1") {
                filhos.push({ x: linha, y: i });
                break;
            }
            else if ( (this.tabuleiro.forma[linha][i] === jogador_adversario_Str) || (this.tabuleiro.forma[linha][i] === "4") || (this.tabuleiro.forma[linha][i] === this.turno.toString()) ) {
                break; 
            } 
        }

        //Verifica linha esquerda
        for (let i = coluna-1; i>=0; i--) {
            if (this.tabuleiro.forma[linha][i] === "1") {
                filhos.push({ x: linha, y: i });
                break;
            }
            else if ( (this.tabuleiro.forma[linha][i] === jogador_adversario_Str) || (this.tabuleiro.forma[linha][i] === "4") || (this.tabuleiro.forma[linha][i] === this.turno.toString()) ) {
                break; 
            } 
        }

        return filhos;

    }



    // Função para remover peça do adversário
    async removerPecaAdversaria(linha,coluna) {
        Utils.mostrarMensagem("Escolha a posição para remover uma peça do adversário.");
    
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        // Após obter uma posição válida
        this.tabuleiro.removerPeca(linha, coluna);
    
        if (this.turno === 2) {
            this.jogador2.pecas--;
        } else {
            this.jogador1.pecas--;
        }

        this.atualizarPecasRemovidas(jogadorAdversario);

        Utils.mostrarMensagem(`Peça do Jogador ${jogadorAdversario} removida.`);
    }
    

    // Função para a fase 1: Colocação das peças
    async fase1(linha,coluna) {

        
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        let filhosRemover;

        // console.log(`Tabuleiro antes de qualquer jogada ${this.tabuleiro.forma}`)

        // this.tabuleiro.imprimir(this.turno);

        if (this.tabuleiro.colocarPeca(linha, coluna, this.turno)) {
            
            if (this.turno === 2){
                this.jogador1.pecas++;
            }
            else{
                this.jogador2.pecas++;
            }

            this.atualizarPecasDosJogadores();

            //console.log(`Tabuleiro depois da jogada ${this.tabuleiro.forma}`)
            this.tabuleiro.imprimir(this.turno);

            if (this.verificarTrilha(linha, coluna)) {
                Utils.mostrarMensagem(`Jogador ${this.turno-1} formou uma trilha!`);
                console.log("Formou a trilha")

                filhosRemover = this.gerarFilhosfase21(jogadorAdversario.toString());
                console.log(`Filhos para remover: ${JSON.stringify(filhosRemover)}`);

                if (this.isComputerTurn) {
                    // Turno do computador: escolhe automaticamente uma peça do adversário para remover
                    const pecaParaRemover = filhosRemover[Math.floor(Math.random() * filhosRemover.length)];
                    this.removerPecaAdversaria(pecaParaRemover.x, pecaParaRemover.y);
                    console.log("Computador removeu uma peça automaticamente");
    
                } else {

                    let { x: i, y: j } = await aguardarClique();
                    while (this.tabuleiro.forma[i][j] !== jogadorAdversario.toString()) {
                        console.log("Posição inválida");
                        // console.log(`i: ${i} j: ${j}`);
                        // Atualizar `i` e `j` diretamente com uma nova chamada de aguardarClique
                        ({ x: i, y: j } = await aguardarClique());
                    }
                    // console.log("Posição válida!");
                    // console.log(`i: ${i} j: ${j}`);
                    this.removerPecaAdversaria(i, j);
                }

                //console.log(`Tabuleiro depois de remover a peça ${this.tabuleiro.forma}`);
                this.atualizarPecasDosJogadores();
                this.tabuleiro.imprimir(this.turno);

            } 
            
        }
    }

    async fase2(linha,coluna,linha2,coluna2) {
        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        let filhosRemover;

        // Executar o movimento
        this.tabuleiro.moverPeca(linha, coluna, linha2, coluna2, this.turno);
        this.tabuleiro.imprimir(this.turno);
    
        if (this.verificarTrilha(linha2, coluna2)) {
            // console.log("Trilha verdadeira")
            Utils.mostrarMensagem(`Jogador ${this.turno-1} formou uma trilha!`);
            filhosRemover = this.gerarFilhosfase21(jogadorAdversario.toString());
            console.log(`Filhos para remover: ${JSON.stringify(filhosRemover)}`)

            if (this.isComputerTurn) {
                // Turno do computador: escolhe automaticamente uma peça do adversário para remover
                const pecaParaRemover = filhosRemover[Math.floor(Math.random() * filhosRemover.length)];
                this.removerPecaAdversaria(pecaParaRemover.x, pecaParaRemover.y);
                console.log("Computador removeu uma peça automaticamente");

            } else{
                let { x: i, y: j } = await aguardarClique();
                while (this.tabuleiro.forma[i][j] !== jogadorAdversario.toString()) {
                    console.log("Posição inválida");
                    // console.log(`i: ${i} j: ${j}`);
                    // Atualizar `i` e `j` diretamente com uma nova chamada de aguardarClique
                    ({ x: i, y: j } = await aguardarClique());
                }
                // console.log("Posição válida!");
                // console.log(`i: ${i} j: ${j}`);
                this.removerPecaAdversaria(i, j);
            }

            this.tabuleiro.imprimir(this.turno);
        }
    }

    async fase3(linha,coluna,linha2,coluna2){

        const jogadorAdversario = (this.turno === 2) ? 3 : 2;

        let filhosRemover;

        // console.log(`Tabuleiro antes de qualquer jogada ${this.tabuleiro.forma}`)

        // this.tabuleiro.imprimir(this.turno);

        if (this.tabuleiro.colocarPeca(linha2, coluna2, this.turno)) {
            
            this.tabuleiro.forma[linha][coluna] = "1";

            //console.log(`Tabuleiro depois da jogada ${this.tabuleiro.forma}`)
            this.tabuleiro.imprimir(this.turno);

            if (this.verificarTrilha(linha2, coluna2)) {
                // console.log("Trilha verdadeira")
                Utils.mostrarMensagem(`Jogador ${this.turno-1} formou uma trilha!`);
                filhosRemover = this.gerarFilhosfase21(jogadorAdversario.toString());
                console.log(`Filhos para remover: ${JSON.stringify(filhosRemover)}`)
    
                if (this.isComputerTurn) {
                    // Turno do computador: escolhe automaticamente uma peça do adversário para remover
                    const pecaParaRemover = filhosRemover[Math.floor(Math.random() * filhosRemover.length)];
                    this.removerPecaAdversaria(pecaParaRemover.x, pecaParaRemover.y);
                    console.log("Computador removeu uma peça automaticamente");
    
                } else{
                    let { x: i, y: j } = await aguardarClique();
                    while (this.tabuleiro.forma[i][j] !== jogadorAdversario.toString()) {
                        console.log("Posição inválida");
                        // console.log(`i: ${i} j: ${j}`);
                        // Atualizar `i` e `j` diretamente com uma nova chamada de aguardarClique
                        ({ x: i, y: j } = await aguardarClique());
                    }
                    // console.log("Posição válida!");
                    // console.log(`i: ${i} j: ${j}`);
                    this.removerPecaAdversaria(i, j);
                }
    
                this.tabuleiro.imprimir(this.turno);
            }       
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

        else if (this.tabuleiro.forma[linha][coluna] === this.turno.toString()) {
            console.log(`Posição já ocupada por peça do jogador ${this.turno-1}`)
            return false;
        }
        
        else if (!this.tabuleiro.jogadaValida(linha, coluna)) {
            console.log(`Jogada inválida. Tente novamente ${this.turno-1}`)
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

    async jogarComputador() {
        let jogada;
    
        if (this.fase === 1) {

            // // Parte dificuldade "dificil"
            const posicoesDisponiveis = this.gerarFilhosfase1();
            let jogada = null;

            for (let i = 0; i < posicoesDisponiveis.length; i++) {
                const posicao = posicoesDisponiveis[i];
                if (this.verificarTrilha(posicao.x,posicao.y)) { // Se verificarTrilha retornar true
                    jogada = { x: posicao.x, y: posicao.y }; // Escolhe essa jogada que forma a trilha
                    break; // Para o loop ao encontrar uma jogada que cria uma trilha
                }
            }

            if (!jogada) {
                jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
            }

            // Parte dificuldade facil

            // const posicoesDisponiveis = this.gerarFilhosfase1();
            // jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
            // await this.fase1(jogada.x, jogada.y);


            // Executa a jogada
            await this.fase1(jogada.x, jogada.y);

        } else if (this.fase === 2) {


            if (((this.turno === 2) && (this.jogador1.pecas === 3)) || ((this.turno === 3) && (this.jogador2.pecas === 3))) {
                // Fase 3: O computador move uma peça para qualquer posição disponível

                // //Parte dificuldade "dificil"
                // const posicoesPecas = this.gerarFilhosfase21(this.turno);
                // let jogada = null;
                // let peca = null;

                // for (let i = 0; i < posicoesPecas.length; i++) {
                //     const posicaoSelecionada = posicoesPecas[i];
                //     const posicoesDisponiveis = this.gerarFilhosfase1();
                //     for (let j = 0; i < posicoesDisponiveis.length; i++) {
                //         const posicao  = posicoesDisponiveis[i];
                //         if (this.verificarTrilha(posicao.x,posicao.y)) { // Se verificarTrilha retornar true

                //             peca = {x: posicaoSelecionada.x, y: posicaoSelecionada.y}
                //             jogada = { x: posicao.x, y: posicao.y }; // Escolhe essa jogada que forma a trilha
                //             console.log(`Peca ${peca.x} ${peca.y} mover para  ${jogada.x} ${jogada.y}`)
                //             break; // Para o loop ao encontrar uma jogada que cria uma trilha
                //         }
                //     }
                // }

                // if (!jogada) {

                //     peca = posicoesPecas[Math.floor(Math.random() * posicoesPecas.length)];
                //     let posicoesDisponiveis = this.gerarFilhosfase1();
                //     console.log(`posicoesDisponiveis: ${posicoesDisponiveis}`)
                    
                //     if (posicoesDisponiveis.length > 0) {
                //         jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
                //     }
                // }

                // await this.fase3(peca.x, peca.y, jogada.x, jogada.y);


                //Parte dificuldade facil
                const posicoesPecas = this.gerarFilhosfase21(this.turno);
                let posicaoSelecionada = posicoesPecas[Math.floor(Math.random() * posicoesPecas.length)];
                let posicoesDisponiveis = this.gerarFilhosfase1();
                console.log(`posicoesDisponiveis: ${posicoesDisponiveis}`)
                
                if (posicoesDisponiveis.length > 0) {
                    jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
                    await this.fase3(posicaoSelecionada.x, posicaoSelecionada.y, jogada.x, jogada.y);
                }

            } else {
                // Fase 2: O computador move uma peça
                const posicoesPecas = this.gerarFilhosfase21(this.turno);
                let posicaoSelecionada = posicoesPecas[Math.floor(Math.random() * posicoesPecas.length)];
                let movimentosPossiveis = this.gerarFilhosfase22(posicaoSelecionada.x, posicaoSelecionada.y);
                while (movimentosPossiveis.length === 0) {
                    posicaoSelecionada = posicoesPecas[Math.floor(Math.random() * posicoesPecas.length)];
                    movimentosPossiveis = this.gerarFilhosfase22(posicaoSelecionada.x, posicaoSelecionada.y);
                    console.log(`O computador selecionou a peça ${posicaoSelecionada.x} ${posicaoSelecionada.y}`)
                }
                if (movimentosPossiveis.length > 0) {
                    jogada = movimentosPossiveis[Math.floor(Math.random() * movimentosPossiveis.length)];
                    await this.fase2(posicaoSelecionada.x, posicaoSelecionada.y, jogada.x, jogada.y);
                }
            }
        } 
    
        this.tabuleiro.jogadas++;
        this.alternarTurno();
        
    }
    
    
    gameOver(){
        if (this.jogador1.pecas <= 2){
            Utils.mostrarMensagem("O jogador 3 ganhou")
            const vencedor = 3;
            this.winner=true;

            return vencedor;

        }

        else if (this.jogador2.pecas <= 2){
            Utils.mostrarMensagem("O jogador 2 ganhou");
            const vencedor = 2;
            this.winner=true;

            return vencedor;
        }

        else if ((this.jogador1.pecas === 3) && (this.jogador2.pecas === 3)){
            this.jogadasFinais++;
            if (this.jogadasFinais>=10){
                Utils.mostrarMensagem("Empate");
                const vencedor = 0;
                this.winner=true;
                return vencedor;
            }
        }

        else if ((this.gerarFilhosfase1() === null)){
            Utils.mostrarMensagem("Não há jogadas possiveis");
            const vencedor = 0;
            this.winner=true;
            return vencedor;
        }

        else {
            let movimentoEncontrado = false;
        
            for (let i = 0; i < this.tabuleiro.forma.length; i++) {
                if (movimentoEncontrado) break;
                
                for (let j = 0; j < this.tabuleiro.forma.length; j++) {
                    if (this.tabuleiro.forma[i][j] === '1') {
                        
                        for (let g = 0; g < this.tabuleiro.forma.length; g++) {
                            if (movimentoEncontrado) break;
                            
                            for (let h = 0; h < this.tabuleiro.forma.length; h++) {
                                if (this.tabuleiro.movimentoValido(i, j, g, h, this.turno)) {
                                    movimentoEncontrado = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        
            // Se não foi encontrado nenhum movimento válido
            if (!movimentoEncontrado) {
                Utils.mostrarMensagem("Não há jogadas possíveis");
                const vencedor = 0;
                this.winner = true;
                return vencedor;
            }
        }
        
        return;

    }


}


async function iniciarJogo() {
    console.log("Função iniciarJogo chamada");
    Utils.mostrarMensagem("Bem-vindo ao Jogo Trilha!");
    // console.log("Descambou");
    let jogador1= new Jogador(2)
    let jogador2 = new Jogador(3);
  
    const startPlayer = document.querySelector('input[name="start"]:checked');
    const multiplayer= document.querySelector('input[name="game-mode"]:checked');
    
    
    if (multiplayer.value == 'multiplayer') {
        if(startPlayer.value== 'start-player-one') {
            jogador1=new Jogador(2);
            jogador2=new Jogador(3);
        }
         if(startPlayer.value== 'start-player-two'){
            jogador1=new Jogador(3);
            jogador2=new Jogador(2);
            
        }
    }
    if (multiplayer.value == 'cpu') {
        if (startPlayer.value=='start-player-one') {
            jogador1=new Jogador(2);
            jogador2=new Jogador(4);
        }
        if (startPlayer.value=='start-player-two') {
            jogador1=new Jogador(4);
            jogador2=new Jogador(2);
        }
    }
    const dimensionRadio = document.querySelector('input[name="dimension"]:checked');
    let numeroQuadrados = 3; // Valor padrão

    // Verifica qual botão de rádio está selecionado
    if (dimensionRadio) {
        switch (dimensionRadio.value) {
            case 'dimension1':
                numeroQuadrados = 2;
                break;
            case 'dimension2':
                numeroQuadrados = 3;
                break;
            case 'dimension3':
                numeroQuadrados = 4;
                break;
            default:
                numeroQuadrados = 3; // Padrão, caso nenhum botão seja selecionado
                break;
        }
    }
    let tabuleiro = new Tabuleiro(numeroQuadrados);


   
    const jogo = new Jogo(jogador1, jogador2, tabuleiro);

    jogo.atualizarPecasDosJogadores();
    jogo.tabuleiro.imprimir(jogo.turno); // Exibe o tabuleiro após o início

    // console.log("Descambou ainda mais");

    await aguardarJogada(jogo);
}


async function aguardarJogada(jogo) {
    let i, j, k, l; // Variáveis para coordenadas dos cliques
    let vencedor;

    // Laço para continuar até que o jogo tenha um vencedor
    while (!jogo.winner) {

        // Atualiza a fase do jogo conforme o número de jogadas
        if (jogo.fase === 1 && jogo.tabuleiro.jogadas > ((3 * jogo.tabuleiro.quadrados)*2)) {
            jogo.fase = 2;
        }

        if (jogo.fase === 2){
            vencedor = jogo.gameOver();
            // console.log(`Acabou e o winner esta a ${jogo.winner}`)
            if (jogo.winner) break; // Sai do loop se o jogo acabou
        }

        Utils.mostrarMensagem(`O jogador ${jogo.turno - 1} faça o seu movimento para a fase ${jogo.fase}`);
        console.log(`A fase do jogo é ${jogo.fase}`);

        // console.log(`Tabuleiro atual: ${jogo.tabuleiro.forma}`)

        console.log(`iscomputreTurn: ${jogo.isComputerTurn}`)

        if (jogo.isComputerTurn) {
            // Chama a função que faz o computador jogar
            // console.log("entrou")
            await jogo.jogarComputador();
        } else {
            // Passo 1: Aguarda o primeiro clique
            const { x: i, y: j } = await aguardarClique();

            console.log(`i: ${i} j: ${j}`)

            if (jogo.fase === 1) {
                // Fase 1: Executa a jogada se for possível
                if (jogo.receberCoordenadasfase1(i, j)) {
                    // console.log("Executa ação para fase 1");
                    await jogo.fase1(i, j);
                    // console.log("Jogada válida na fase 1!");

                    jogo.tabuleiro.jogadas++;
                    jogo.alternarTurno();

                } else {
                    console.log("Jogada inválida na fase 1!");
                }
                // console.log(`Tabuleiro atual: ${jogo.tabuleiro.forma}`)

            } else if (jogo.fase === 2) {

                // Fase 2: Aguarda o segundo clique
                const { x: k, y: l } = await aguardarClique();

                // console.log(`Turno é ${jogo.turno}`)
                // console.log(`Jogador 2 tem ${jogo.jogador1.pecas} pecas`)
                // console.log(`Jogador 3 tem ${jogo.jogador1.pecas} pecas`)

                if (((jogo.turno === 2) && (jogo.jogador1.pecas === 3)) || ((jogo.turno === 3) && (jogo.jogador2.pecas === 3))){

                    if (jogo.receberCoordenadasfase1(k,l)) {        // Usamos a verificação da fase 1 porque é muito parecido à fase 3
                        await jogo.fase3(i, j, k, l)
                        // console.log("Jogada válida na fase 3")
                        jogo.tabuleiro.jogadas++;
                        jogo.alternarTurno();
                    } else {
                        console.log("Jogada inválida na fase 3")
                    }

                }

                else {
                    
                    // Verifica se a jogada com dois cliques é válida
                    if (jogo.receberCoordenadasfase2(i, j, k, l)) {
                        // Executa ação para fase 2
                        await jogo.fase2(i, j, k, l);
                        // console.log("Jogada válida na fase 2!");
                        // Alternar turno
                        jogo.tabuleiro.jogadas++;
                        jogo.alternarTurno();

                    } else {
                        console.log("Jogada inválida na fase 2!");
                    }
                }
            }
        }

    }
    // console.log(`Vencedor no aguardar jogada: ${vencedor}`)
    return vencedor;
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
    console.log("Clica")
    document.getElementById("play-button").addEventListener("click", async () => {
        const vencedor = await iniciarJogo();
        // console.log(`Vencedor no final: ${vencedor}`)
    });
});
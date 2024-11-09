import { Utils } from './utils.js';
import { Jogador } from './jogador.js';
import { Tabuleiro } from './tabuleiro.js';

console.log("Script carregado");

let vitorias_jog1=0;
let vitorias_jog2=0;

export class Jogo {
    constructor(jogador1, jogador2, tabuleiro,turno) {
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.tabuleiro = tabuleiro;
        this.turno = turno; // 2 para jogador1, 3 para jogador2
        this.jogadas = 0; // Contador de jogadas para mudar de fase
        this.winner = false;
        this.fase = 1;
        this.isComputerTurn = this.turno === 3;
    }  

    alternarTurno() {
        this.turno = this.turno === 2 ? 3 : 2;
        this.isComputerTurn = this.turno === 3;
    }

    atualizarPecasDosJogadores() {
        const pecasJogadorAzul = document.getElementById('pecas-jogador-azul');
        const pecasJogadorVermelho = document.getElementById('pecas-jogador-vermelho');
    
        // Limpa o conteúdo atual dos contêineres
        pecasJogadorAzul.innerHTML = '';
        pecasJogadorVermelho.innerHTML = '';
    
        // Adiciona as peças do jogador azul
        for (let i = 0; i < (3 * this.tabuleiro.quadrados - this.jogador1.pecas); i++) {
            const pecaAzul = document.createElement('div');
            pecaAzul.classList.add('bola', 'bola-azul');
            pecasJogadorAzul.appendChild(pecaAzul);
        }
    
        // Adiciona as peças do jogador vermelho
        for (let i = 0; i < (3 * this.tabuleiro.quadrados - this.jogador2.pecas); i++) {
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
            pecaRemovida.classList.add('bola-azul');
            contRemovidasAzul.appendChild(pecaRemovida);
        } else if (jogador === 3) {
            // Jogador vermelho
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
            console.log(`Posição já ocupada por peça do jogador ${this.turno}`)
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

    async jogarComputador() {
        let jogada;
    
        if (this.fase === 1) {
            // Fase 1: O computador coloca uma peça em qualquer posição disponível
            const posicoesDisponiveis = this.gerarFilhosfase1();
            jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
            await this.fase1(jogada.x, jogada.y);
        } else if (this.fase === 2) {
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
        } if (((this.turno === 2) && (this.jogador1.pecas === 3)) || ((this.turno === 3) && (this.jogador2.pecas === 3))) {
            // Fase 3: O computador move uma peça para qualquer posição disponível
            const posicoesPecas = this.gerarFilhosfase21(this.turno);
            let posicaoSelecionada = posicoesPecas[Math.floor(Math.random() * posicoesPecas.length)];
            let posicoesDisponiveis = this.gerarFilhosfase1();
            console.log(`posicoesDisponiveis: ${posicoesDisponiveis}`)
            
            if (posicoesDisponiveis.length > 0) {
                jogada = posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
                await this.fase3(posicaoSelecionada.x, posicaoSelecionada.y, jogada.x, jogada.y);
            }
        }
    
        this.tabuleiro.jogadas++;
        this.alternarTurno();
        
    }
    
    
    gameOver(){
        if (this.jogador1.pecas <= 2){
            Utils.mostrarMensagem("O jogador 2 ganhou")
            this.winner=true;
            vitorias_jog2++;
        }

        else if (this.jogador2.pecas <= 2){
            Utils.mostrarMensagem("O jogador 1 ganhou")
            this.winner=true;
            vitorias_jog1++;
        }
        this.atualizarClassificacoes();
    }

    atualizarClassificacoes() {
        document.getElementById("vitorias-jogador1").innerText = `Vitórias do Jogador 1: ${this.vitorias_jog1}`;
        document.getElementById("vitorias-jogador2").innerText = `Vitórias do Jogador 2: ${this.vitorias_jog2}`;
    }


    // clone() {
    //     // Cria uma nova instância do jogo
    //     const novoJogo = new Jogo(this.jogador1, this.jogador2, this.tabuleiro);

    //     // Copia o estado do tabuleiro
    //     novoJogo.tabuleiro = structuredClone(this.tabuleiro);

    //     // Copia outros atributos importantes (jogadores, turno, fase, etc.)
    //     novoJogo.jogador1 = structuredClone(this.jogador1);
    //     novoJogo.jogador2 = structuredClone(this.jogador2);
    //     novoJogo.turno = this.turno;
    //     novoJogo.fase = this.fase;

    //     return novoJogo;
    // }


}


// Função para iniciar o jogo
async function iniciarJogo() {
    console.log("Função iniciarJogo chamada");
    Utils.mostrarMensagem("Bem-vindo ao Jogo Trilha!");
    // console.log("Descambou");
    let jogador1 = new Jogador(2);
    let jogador2 = new Jogador(3);

    const dimensionRadio = document.querySelector('input[name="dimension"]:checked');
    let numeroQuadrados = 3; // Valor padrão

    // Verifica qual botão de rádio está selecionado
    if (dimensionRadio) {
        switch (dimensionRadio.value) {
            case 'dimension1':
                numeroQuadrados = 3;
                break;
            case 'dimension2':
                numeroQuadrados = 4;
                break;
            case 'dimension3':
                numeroQuadrados = 5;
                break;
            default:
                numeroQuadrados = 3; // Padrão, caso nenhum botão seja selecionado
                break;
        }
    }
    let tabuleiro = new Tabuleiro(numeroQuadrados);

    const startPlayer = document.querySelector('input[name="start"]:checked');
    let start_player = 2; // Valor padrão

    // Verifica qual botão de rádio está selecionado
    if (startPlayer) {
        switch (startPlayer.value) {
            case 'start-player-one':
                start_player = 2;
                break;
            case 'start-player-two':
                start_player = 3;
                break;
            default:
                start_player = 2; // Padrão, caso nenhum botão seja selecionado
                break;
        }
    }

    const jogo = new Jogo(jogador1, jogador2, tabuleiro,start_player);

    jogo.atualizarPecasDosJogadores();
    jogo.tabuleiro.imprimir(jogo.turno); // Exibe o tabuleiro após o início

    // console.log("Descambou ainda mais");

    await aguardarJogada(jogo);
}

async function aguardarJogada(jogo) {
    let i, j, k, l; // Variáveis para coordenadas dos cliques

    // Laço para continuar até que o jogo tenha um vencedor
    while (!jogo.winner) {

        // Atualiza a fase do jogo conforme o número de jogadas
        if (jogo.fase === 1 && jogo.tabuleiro.jogadas > ((3 * jogo.tabuleiro.quadrados)*2)) {
            jogo.fase = 2;
        }

        if (jogo.fase === 2){
            jogo.gameOver();
            // console.log(`Acabou e o winner esta a ${jogo.winner}`)
            if (jogo.winner) break; // Sai do loop se o jogo acabou
        }

        Utils.mostrarMensagem(`O jogador ${jogo.turno-1} faça o seu movimento para a fase ${jogo.fase}`);
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
        await iniciarJogo();
    });
});
import { Utils } from './utils.js';
import { Jogo } from './jogo.js';

export class Tabuleiro {
    constructor(n) {
        this.jogadas = 1;
        this.tamanho = 4*n + 1;
        this.temp_tabuleiro=this.criarMatriz();
        this.gerarForma();
        this.quadrados = n;
        this.acao = 1;      // 1 - colocar ; 2 - mover ; 3 - remover
        this.podeMover = false;
    }

    criarMatriz() {
        // Inicializa a matriz com 0s
        const matriz = Array.from({ length: this.tamanho }, () => Array(this.tamanho).fill(0));
    
        for (let i = 0; i < this.tamanho; i++) {  // Para cada linha
            // Calcular o número de zeros
            let numZeros;
            if (i <= Math.floor((this.tamanho - 1) / 2)) {
                numZeros = this.tamanho - 2 * (i + 1);  // Para as linhas superiores
            } else {
                numZeros = this.tamanho - 2 * (this.tamanho - i);  // Para as linhas inferiores
            }
    
            if (numZeros > 0) {  // Verifica se há zeros a serem colocados
                const startIndex = Math.floor((this.tamanho - numZeros) / 2);  // Índice inicial para colocar os zeros
    
                for (let j = startIndex; j < startIndex + numZeros; j++) {
                    matriz[i][j] = '0';  // Coloca 1 na linha
                    matriz[j][i] = '9';  // Coloca 2 na coluna
                }
            }
        }
        
        return matriz;
    }

    gerarForma() {
    
        const meio = Math.floor(this.tamanho / 2);
    
        // Define o centro do tabuleiro
        this.temp_tabuleiro[meio][meio] = '4';
    
        // Adiciona as casas (1) e as conexões (1) em camadas concêntricas
        for (let i = 0; i < meio; i++) {
            if (i%2 !== 0){
                this.temp_tabuleiro[i][i] = '4';
                this.temp_tabuleiro[i][this.tamanho - 1 - i] = '4';
                this.temp_tabuleiro[this.tamanho- 1 - i][i] = '4';
                this.temp_tabuleiro[this.tamanho- 1 - i][this.tamanho- 1 - i] = '4';
            } else if (i%2 === 0){
                this.temp_tabuleiro[i][i] = '1';
                this.temp_tabuleiro[i][this.tamanho- 1 - i] = '1';
                this.temp_tabuleiro[this.tamanho- 1 - i][i] = '1';
                this.temp_tabuleiro[this.tamanho- 1 - i][this.tamanho- 1 - i] = '1';
            }
    
            if (i >= 0 && i < meio) {
                if (i%2 !== 0){
                    this.temp_tabuleiro[i][meio] = '9';
                    this.temp_tabuleiro[this.tamanho- 1 - i][meio] = '9';
                    this.temp_tabuleiro[meio][i] = '0';
                    this.temp_tabuleiro[meio][this.tamanho- 1 - i] = '0';
                } else{
                    this.temp_tabuleiro[i][meio] = '1';
                    this.temp_tabuleiro[this.tamanho- 1 - i][meio] = '1';
                    this.temp_tabuleiro[meio][i] = '1';
                    this.temp_tabuleiro[meio][this.tamanho- 1 - i] = '1';    
                }
    
            }
    
        }

        // Define as células ao redor do centro como '1'
        const adjacentes = [
            [meio - 1, meio],
            [meio + 1, meio],
            [meio, meio - 1],
            [meio, meio + 1]
        ];

        adjacentes.forEach(([x, y]) => {
            if (x >= 0 && x < this.tamanho && y >= 0 && y < this.tamanho) {
                this.temp_tabuleiro[x][y] = '4';
            }
        });

        for (let i=0; i<this.tamanho; i++){
            // console.log("AAA")
            
            if (this.temp_tabuleiro[i][i] === '4'){
                // console.log("Entrou")
                for (let j=i; j<this.tamanho-i; j++){
                    if (j === Math.floor(this.tamanho / 2)){
                        continue;
                    }
                    this.temp_tabuleiro[i][j] = '4';
                    this.temp_tabuleiro[j][i] = '4';
                    this.temp_tabuleiro[this.tamanho-i-1][j] = '4';
                    this.temp_tabuleiro[j][this.tamanho-i-1] = '4';
                    
                }
            }
        }
    
        this.forma =this.temp_tabuleiro;
    
    }

    imprimir(jogadorAtual) {
        const containerTabuleiro = document.getElementById('tabuleiro');
        containerTabuleiro.innerHTML = '';  // Limpa o conteúdo anterior do tabuleiro
    
        const table = document.createElement('table'); // Cria uma nova tabela
        table.classList.add('tabuleiro-grid'); // Adiciona a classe CSS da tabela
    
        //console.log(`Forma: ${this.forma}`)

        // Itera sobre cada linha da matriz
        this.forma.forEach((linha, i) => {
            const tr = document.createElement('tr'); // Cria uma nova linha da tabela
    
            // Itera sobre cada célula da linha
            linha.forEach((celula, j) => {
                const td = document.createElement('td'); // Cria uma nova célula da linha
                td.classList.add('celula'); // Adiciona a classe CSS comum a todas as células
    
                // Verifica o valor da célula e adiciona o conteúdo correspondente
                if (celula === '1') {
                    // Casa disponível
                    // console.log("imprimiu a casa 1")
                    const bola = document.createElement('button');
                    bola.classList.add('bola'); // Classe para representar uma casa vazia (bola)
                    td.classList.add('casa-disponivel'); // Classe específica para casas disponíveis
                    td.appendChild(bola); // Adiciona o botão à célula
    
                } else if (celula === '2') {
                    // Peça do jogador azul
                    const bolaJogador = document.createElement('button');
                    bolaJogador.classList.add('bola-azul'); // Classe para peça do jogador azul
                    td.classList.add('jogador-azul'); // Classe específica para a célula do jogador azul
                    td.appendChild(bolaJogador); // Adiciona o botão à célula
    
                } else if (celula === '3') {
                    // Peça do jogador vermelho
                    const bolaJogador = document.createElement('button');
                    bolaJogador.classList.add('bola-vermelha'); // Classe para peça do jogador vermelho
                    td.classList.add('jogador-vermelho'); // Classe específica para a célula do jogador vermelho
                    td.appendChild(bolaJogador); // Adiciona o botão à célula
    
                } else if (celula === '0') {
                    // Linha de ligação ou célula vazia
                    // console.log("Detetou um 0")
                    const linhaLigacao = document.createElement('div');
                    linhaLigacao.classList.add('linha-horizontal'); // Classe para linha horizontal
                    td.appendChild(linhaLigacao); // Adiciona a linha à célula
    
                } else if (celula === '4') {
                    // Centro do tabuleiro
                    td.classList.add('centro'); // Classe específica para o centro do tabuleiro

                } else if (celula === '9') {
                    // Linha de ligação ou célula vazia
                    // console.log("Detetou um 9")
                    const linhaLigacao = document.createElement('div');
                    linhaLigacao.classList.add('linha-vertical'); // Classe para linha horizontal
                    td.appendChild(linhaLigacao); // Adiciona a linha à célula
    
                }
    
                // Evento de clique único para todas as células
                td.addEventListener('click', () => {
                    const evento = new CustomEvent('jogadaClicada', {
                        detail: { i, j } // Passa as coordenadas (i, j) da célula
                    });
                    document.dispatchEvent(evento); // Despacha o evento para capturar em outro lugar
                });
    
                tr.appendChild(td); // Adiciona a célula à linha da tabela
            });
            
            table.appendChild(tr); // Adiciona a linha à tabela
        });
    
        containerTabuleiro.appendChild(table); // Adiciona a tabela completa ao contêiner do tabuleiro
    }  

    jogadaValida(linha, coluna) {
        return linha >= 0 && linha < this.forma.length && coluna >= 0 && coluna < this.forma[0].length && this.forma[linha][coluna] === '1';
    }

    movimentoValido(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino, jogadorId){

        // Verifica se a posição de destino é válida (deve ser um "1")
        if (this.forma[linhaDestino][colunaDestino] !== '1') {
            console.log('A posição de destino não está disponível.');
            return false;
        }

        // Verifica se a peça pode ser movida (mesma linha ou coluna)
        if (linhaOrigem !== linhaDestino && colunaOrigem !== colunaDestino) {
            console.log('Movimentos diagonais não são permitidos.');
            return false;
        }

        // Verifica as células entre a origem e o destino
        const deltaLinha = linhaDestino - linhaOrigem;
        const deltaColuna = colunaDestino - colunaOrigem;

        const passoLinha = deltaLinha === 0 ? 0 : deltaLinha > 0 ? 1 : -1; // 0 se não se move na linha
        const passoColuna = deltaColuna === 0 ? 0 : deltaColuna > 0 ? 1 : -1; // 0 se não se move na coluna

        let linhaAtual = linhaOrigem + passoLinha;
        let colunaAtual = colunaOrigem + passoColuna;

        while (linhaAtual !== linhaDestino || colunaAtual !== colunaDestino) {
            if ((this.forma[linhaAtual][colunaAtual] !== '0') && (this.forma[linhaAtual][colunaAtual] !== '9')) {
                // console.log(`Peça que esta no caminho é ${this.forma[linhaAtual][colunaAtual]} e esta na posiçao ${linhaAtual} ${colunaAtual}`)
                console.log('Movimento inválido, há uma peça no caminho.');
                return false;
            }
            linhaAtual += passoLinha;
            colunaAtual += passoColuna;
        }

        return true;
    }

    moverPeca(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino, jogadorId) {
        // Realiza o movimento
        this.forma[linhaDestino][colunaDestino] = jogadorId.toString();
        this.forma[linhaOrigem][colunaOrigem] = '1'; // A posição de origem agora está vazia
        return true;
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

    retornarPeca(linha, coluna,) {
        return this.forma[linha][coluna];
    }

}
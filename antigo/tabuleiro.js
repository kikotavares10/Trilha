import { Utils } from './utils.js';
import { Jogo } from './jogo.js';

export class Tabuleiro {
    constructor(n) {
        this.jogadas = 1;
        this.gerarForma(n*2+1);
        this.tamanho = n*2+1;
        this.quadrados = n;
        this.acao = 1;      // 1 - colocar ; 2 - mover ; 3 - remover
        this.podeMover = false;
    }

    gerarForma(dimensao) {
        console.log(`O tamnho de n é ${dimensao}`)
        const tabuleiro = Array.from({ length: dimensao }, () => Array(dimensao).fill('0'));
        const meio = Math.floor(dimensao / 2);

        // Define o centro do tabuleiro
        tabuleiro[meio][meio] = '4';

        // Adiciona as casas (1) e as conexões (1) em camadas concêntricas
        for (let i = 0; i < meio; i++) {
            tabuleiro[i][i] = '1';
            tabuleiro[i][dimensao - 1 - i] = '1';
            tabuleiro[dimensao - 1 - i][i] = '1';
            tabuleiro[dimensao - 1 - i][dimensao - 1 - i] = '1';

            if (i >= 0 && i < meio) {
                tabuleiro[i][meio] = '1';
                tabuleiro[dimensao - 1 - i][meio] = '1';
                tabuleiro[meio][i] = '1';
                tabuleiro[meio][dimensao - 1 - i] = '1';
            }
        }

        this.forma = tabuleiro;
    }

    imprimir(jogadorAtual) {
        const containerTabuleiro = document.getElementById('tabuleiro');
        containerTabuleiro.innerHTML = '';  // Limpa o conteúdo anterior do tabuleiro
    
        const table = document.createElement('table'); // Cria uma nova tabela
        table.classList.add('tabuleiro-grid'); // Adiciona a classe CSS da tabela
    
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
                    const linhaLigacao = document.createElement('div');
                    linhaLigacao.classList.add('linha-horizontal'); // Classe para linha horizontal
                    td.appendChild(linhaLigacao); // Adiciona a linha à célula
    
                } else if (celula === '4') {
                    // Centro do tabuleiro
                    td.classList.add('centro'); // Classe específica para o centro do tabuleiro
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
            Utils.mostrarMensagem('A posição de destino não está disponível.');
            return false;
        }

        // Verifica se a peça pode ser movida (mesma linha ou coluna)
        if (linhaOrigem !== linhaDestino && colunaOrigem !== colunaDestino) {
            Utils.mostrarMensagem('Movimentos diagonais não são permitidos.');
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
            if (this.forma[linhaAtual][colunaAtual] !== '0') {
                Utils.mostrarMensagem('Movimento inválido, há uma peça no caminho.');
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
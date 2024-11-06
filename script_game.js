import { Tabuleiro, Jogo, Jogador} from './jogo_site.js';

document.getElementById("botao-mensagem").addEventListener("click", () => {
    console.log("Botão foi clicado!"); // Verifica se o evento de clique está funcionando

    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = "O tabuleiro foi gerado!";

    const tabuleiroDiv = document.getElementById("tabuleiro");
    tabuleiroDiv.innerHTML = "";  // Limpa o conteúdo para recriar o tabuleiro

    let jogador1 = new Jogador(2);
    let jogador2 = new Jogador(3);
    let tabuleiro = new Tabuleiro();

    const jogo = new Jogo(jogador1, jogador2, tabuleiro);
    console.log(jogo.tabuleiro.forma); // Exibe o tabuleiro gerado no console para depuração

    console.log("Passou")

    const matrizLigacoes=criarMatrizLigacoes(9);
    desenharTabuleiroCompleto(jogo.tabuleiro.forma,matrizLigacoes);
});


function criarMatrizLigacoes(n) {
    // Inicializa a matriz auxiliar com 0s
    const matrizLigacoes = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {  // Para cada linha
        let numZeros;
        
        // Calcula a quantidade de zeros em cada linha, diferenciando parte superior e inferior
        if (i <= Math.floor((n - 1) / 2)) {
            numZeros = n - 2 * (i + 1);  // Parte superior
        } else {
            numZeros = n - 2 * (n - i);  // Parte inferior
        }

        if (numZeros > 0) {  // Verifica se há zeros a serem colocados
            const startIndex = Math.floor((n - numZeros) / 2);  // Índice inicial para colocar os zeros

            for (let j = startIndex; j < startIndex + numZeros; j++) {
                matrizLigacoes[i][j] = 1;  // Define 1 para uma linha horizontal na posição [i][j]
                matrizLigacoes[j][i] = 2;  // Define 2 para uma linha vertical na posição [j][i]
            }
        }
    }
    
    return matrizLigacoes;
}


function desenharTabuleiroCompleto(tabuleiro, matrizLigacoes) {
    const containerTabuleiro = document.getElementById('tabuleiro');
    containerTabuleiro.innerHTML = '';  // Limpa o conteúdo anterior
    const table = document.createElement('table');
    table.classList.add('tabuleiro-grid');

    for (let i = 0; i < tabuleiro.length; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < tabuleiro[i].length; j++) {
            const td = document.createElement('td');
            td.classList.add('celula-tabuleiro');

            // Verifica a matriz do tabuleiro original para desenhar casas e o centro
            if (tabuleiro[i][j] === '1') {
                const casa = document.createElement('div');
                casa.classList.add('casa');
                td.appendChild(casa);
            } else if (tabuleiro[i][j] === '4') {
                const centro = document.createElement('div');
                centro.classList.add('centro');
                td.appendChild(centro);
            }
            // Verifica a matriz de ligações para desenhar linhas horizontais ou verticais
            else if (matrizLigacoes[i][j] === 1) {
                const linhaHorizontal = document.createElement('div');
                linhaHorizontal.classList.add('linha-horizontal');
                td.appendChild(linhaHorizontal);
            } else if (matrizLigacoes[i][j] === 2) {
                const linhaVertical = document.createElement('div');
                linhaVertical.classList.add('linha-vertical');
                td.appendChild(linhaVertical);
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    containerTabuleiro.appendChild(table);
}

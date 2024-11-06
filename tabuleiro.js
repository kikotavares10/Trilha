let tabuleiro = [
    ['1', '0', '0', '1', '0', '0', '1'],
    ['0', '1', '0', '1', '0', '1', '0'],
    ['0', '0', '1', '1', '1', '0', '0'],
    ['1', '1', '1', '4', '1', '1', '1'],
    ['0', '0', '1', '1', '1', '0', '0'],
    ['0', '1', '0', '1', '0', '1', '0'],
    ['1', '0', '0', '1', '0', '0', '1']
];
  

// Função para imprimir o tabuleiro no terminal
function imprimirTabuleiro(tabuleiro) {
    for (let linha of tabuleiro) {
        console.log(linha.join(' '));  // Imprime cada linha, separando os elementos por espaços
    }
}

// Chama a função para imprimir o tabuleiro
imprimirTabuleiro(tabuleiro);
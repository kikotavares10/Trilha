import { Jogo } from './jogo.js';

// Selecionando os elementos de cada seção
const configurations = document.getElementById('configurations');
const instrucoesButton = document.getElementById('instrucoes-button');
const forfeitButton = document.getElementById('forfeit-button');
const instrucoesPanel = document.getElementById('instrucoes');
const classificacoesPanel = document.getElementById('classificacoes');
const closeInstrucoes = document.getElementById('fechar-instrucoes');
const closeClassificacoes = document.getElementById('fechar-classificacoes');
const playButton = document.getElementById('play-button');
const classificacoesButton = document.getElementById('classificacao-button');
const botoes_game=document.getElementById('botoes_game');
const game = document.getElementById('game');

const loginBox = document.getElementById('login-box');
const submitButton = document.getElementById('submit-button');
const botoes = document.getElementById('botoes');


submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    loginBox.classList.add('hidden');
    configurations.classList.remove('hidden');
    botoes.classList.remove('hidden')
    botoes_game.classList.remove('hidden')
});


instrucoesButton.addEventListener('click', () => {
    instrucoesPanel.classList.remove('hidden');
});

closeInstrucoes.addEventListener('click', () => {
    instrucoesPanel.classList.add('hidden');
});

playButton.addEventListener('click', (event) => {
    event.preventDefault();
    configurations.classList.add('hidden');
    botoes_game.classList.add('hidden');
    game.classList.remove('hidden');
});

forfeitButton.addEventListener('click', (event) => {
    event.preventDefault();
    configurations.classList.remove('hidden');
    botoes_game.classList.remove('hidden');
    game.classList.add('hidden');
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play-button").addEventListener("click", async () => {
        await iniciarJogo(); 
    });
});

classificacoesButton.addEventListener('click', () => {
    classificacoesPanel.classList.remove('hidden');
    this.atualizarClassificacoes();
});

closeClassificacoes.addEventListener('click', () => {
    classificacoesPanel.classList.add('hidden');
});

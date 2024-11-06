// Selecionando os elementos de cada seção
const loginBox = document.getElementById('login-box');
const submitButton = document.getElementById('submit-button');
const configurations = document.getElementById('configurations');
const instrucoesButton = document.getElementById('instrucoes-button');
const forfeitButton = document.getElementById('forfeit-button');
const instrucoesPanel = document.getElementById('instrucoes');
const closeInstrucoes = document.getElementById('fechar-instrucoes');
const title = document.getElementById('title');
const logo = document.getElementById('logo');
const playButton = document.getElementById('play-button');
const classificacaoButton = document.getElementById('classificacao-button');
const botoes = document.getElementById('botoes')
const botoes_game=document.getElementById('botoes_game');


// Função para exibir a seção de configurações após o login
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    loginBox.classList.add('hidden');
    configurations.classList.remove('hidden');
    botoes.classList.remove('hidden')
    botoes_game.classList.remove('hidden')
    document.getElementById('footer').classList.remove('hidden'); // Exibe o footer
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
});

forfeitButton.addEventListener('click', (event) => {
    event.preventDefault();
    configurations.classList.remove('hidden');
    botoes_game.classList.remove('hidden');
});
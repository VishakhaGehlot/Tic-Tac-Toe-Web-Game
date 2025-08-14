let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'human';
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const gameResult = document.getElementById('gameResult');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');

function setGameMode(mode) {
  gameMode = mode;
  const buttons = document.querySelectorAll('.mode-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  if (mode === 'human') {
    buttons[0].classList.add('active');
  } else {
    buttons[1].classList.add('active');
  }

  resetGame();
}

function makeMove(index) {
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add('taken', currentPlayer.toLowerCase());

  if (checkWinner()) {
    endGame(`Player ${currentPlayer} wins! 🎉`);
    scores[currentPlayer]++;
    updateScoreDisplay();
    return;
  }

  if (board.every(cell => cell !== '')) {
    endGame("It's a draw! 🤝");
    scores.draw++;
    updateScoreDisplay();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateGameStatus();

  if (gameMode === 'computer' && currentPlayer === 'O' && gameActive) {
    gameStatus.innerHTML = `<span class="thinking">Computer is thinking... 🤔</span>`;
    setTimeout(makeComputerMove, 800);
  }
}

function makeComputerMove() {
  if (!gameActive) return;

  const bestMove = getBestMove();
  makeMove(bestMove);
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = 0;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const result = evaluateBoard();
  if (result !== null) return result;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function evaluateBoard() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === 'O' ? 1 : -1;
    }
  }
  return board.every(cell => cell !== '') ? 0 : null;
}


function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {

      cells[a].classList.add('winning-cell');
      cells[b].classList.add('winning-cell');
      cells[c].classList.add('winning-cell');
      return true;
    }
  }
  return false;
}


function endGame(message) {
  gameActive = false;
  gameResult.innerHTML = `<div class="${message.includes('wins') ? 'winner' : 'draw'}">${message}</div>`;
  gameStatus.innerHTML = 'Game Over';
}


function updateGameStatus() {
  if (gameActive) {
    const playerName = gameMode === 'computer' && currentPlayer === 'O' ? 'Computer' : `Player ${currentPlayer}`;
    gameStatus.innerHTML = `Current Player: <span class="current-player">${playerName}</span>`;
  }
}


function updateScoreDisplay() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draw;
}


function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  gameResult.innerHTML = '';

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'x', 'o', 'winning-cell');
  });

  updateGameStatus();
}


function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  updateScoreDisplay();
}


updateGameStatus();
updateScoreDisplay();
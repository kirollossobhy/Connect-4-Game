const rows = 6;
const cols = 7;
const connect4 = document.getElementById('connect4');
let currentPlayer = 'red';
const currentPlayerDisplay = document.getElementById('currentPlayer');
const winnerDisplay = document.getElementById('winnerDisplay');
const playAgainButton = document.getElementById('playAgainButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const onePlayerButton = document.getElementById('onePlayerButton');
const redPlayerButton = document.getElementById('redPlayerButton');
const yellowPlayerButton = document.getElementById('yellowPlayerButton');
let playerColor = 'red';
let redScore = 0;
let yellowScore = 0;
const redScoreDisplay = document.getElementById('redScore');
const yellowScoreDisplay = document.getElementById('yellowScore');
let isTwoPlayerMode = true;

// Create the grid
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', handleCellClick);
        connect4.appendChild(cell);
    }
}

twoPlayerButton.addEventListener('click', function() {
    isTwoPlayerMode = true;
    twoPlayerButton.classList.add('active');
    onePlayerButton.classList.remove('active');
    resetGame();
});

onePlayerButton.addEventListener('click', function() {
    isTwoPlayerMode = false;
    onePlayerButton.classList.add('active');
    twoPlayerButton.classList.remove('active');
    resetGame();
});

redPlayerButton.addEventListener('click', function() {
    playerColor = 'red';
    redPlayerButton.classList.add('active');
    yellowPlayerButton.classList.remove('active');
    resetGame();
});

yellowPlayerButton.addEventListener('click', function() {
    playerColor = 'yellow';
    yellowPlayerButton.classList.add('active');
    redPlayerButton.classList.remove('active');
    resetGame();
});

playAgainButton.addEventListener('click', resetGame);

function resetGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('red', 'yellow');
        cell.addEventListener('click', handleCellClick);
    });
    currentPlayer = playerColor;
    currentPlayerDisplay.style.backgroundColor = currentPlayer;
    winnerDisplay.textContent = '';
    // playAgainButton.style.display = 'none'; // Keep the button displayed
}

function handleCellClick(event) {
    const cell = event.target;
    const col = cell.dataset.col;

    // Player move
    if (makeMove(col, currentPlayer)) {
        if (checkWinner(currentPlayer)) {
            winnerDisplay.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`;
            updateScore(currentPlayer);
            disableBoard();
        } else {
            if (isTwoPlayerMode) {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                currentPlayerDisplay.style.backgroundColor = currentPlayer;
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                currentPlayerDisplay.style.backgroundColor = currentPlayer;
                setTimeout(computerMove, 500); // Delay for computer move
            }
        }
    }
}

function computerMove() {
    const col = Math.floor(Math.random() * cols); // Random column for computer move
    if (makeMove(col, currentPlayer)) {
        if (checkWinner(currentPlayer)) {
            winnerDisplay.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`;
            updateScore(currentPlayer);
            disableBoard();
        } else {
            currentPlayer = 'red';
            currentPlayerDisplay.style.backgroundColor = currentPlayer;
        }
    } else {
        computerMove(); // Retry if the column is full
    }
}

function makeMove(col, player) {
    for (let r = rows - 1; r >= 0; r--) {
        const targetCell = document.querySelector(`.cell[data-row='${r}'][data-col='${col}']`);
        if (!targetCell.classList.contains('red') && !targetCell.classList.contains('yellow')) {
            targetCell.classList.add(player);
            return true;
        }
    }
    return false;
}

function checkWinner(player) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (checkDirection(r, c, player, 1, 0) || // Horizontal
                checkDirection(r, c, player, 0, 1) || // Vertical
                checkDirection(r, c, player, 1, 1) || // Diagonal /
                checkDirection(r, c, player, 1, -1)) { // Diagonal \
                return true;
            }
        }
    }
    return false;
}

function updateScore(player) {
    if (player === 'red') {
        redScore++;
        redScoreDisplay.textContent = redScore;
    } else {
        yellowScore++;
        yellowScoreDisplay.textContent = yellowScore;
    }
    playAgainButton.style.display = 'block';
}

function checkDirection(row, col, player, rowDir, colDir) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = parseInt(row) + i * rowDir;
        const c = parseInt(col) + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
            if (cell && cell.classList.contains(player)) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }
    }
    return false;
}

function disableBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}
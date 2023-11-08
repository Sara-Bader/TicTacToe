
class Board {
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.gameBoard = ["", "", "", "", "", "", "", "", ""];
        this.currentPlayer = "X";
        this.player1Name = "";
        this.player2Name = "";
        this.player1Score = 0;
        this.player2Score = 0;
        this.isHumanGame = true;
        this.player1Symbol = "X"; 
        this.player2Symbol = "O";
        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.selectedPlayMode = null; 
    }

    setPlayers(player1Name, player2Name) {
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.updateScoreDisplay();
    }

    beginGame() {
        this.assignSymbols();
        this.showHeader();
        this.hideNonGameElements(); 
        this.displayBoard();
        this.attachEventListeners();
        
        document.querySelector('.game-container').style.display = 'flex';
        document.querySelector('.score-panel').style.display = 'block';
        
    }

    isBoardFull() {
        return this.gameBoard.every(cell => cell !== "");
    }
    
    showHeader() {
        const header = document.querySelector('header');
        header.style.display = 'block'; 
    }

    hideNonGameElements() {
        const nonGameElements = document.querySelectorAll('.non-game-element'); 
        nonGameElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    createBoardUI() {
        this.boardContainer.innerHTML = ''; 
        for (let i = 0; i < 9; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            this.boardContainer.appendChild(square);
        }
    }
    

    reset() {
        this.currentPlayer = this.player1Symbol; 
        this.gameBoard.fill("");
        this.clearBoardUI();
        this.updateBoardUI();
    }

    displayBoard() {
        this.createBoardUI(); 
        this.boardContainer.style.display = "grid"; 
        
    }

  
    clearBoardUI() {
        Array.from(this.boardContainer.children).forEach((square) => {
            square.innerText = "";
            square.classList.remove("X", "O");
        });
    }

    attachEventListeners() {
        this.boardContainer.addEventListener("click", this.handleSquareClick);
    }

    assignSymbols() {
        const symbols = ["X", "O"];
        this.player1Symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.player2Symbol = this.player1Symbol === "X" ? "O" : "X";
    
        this.currentPlayer = Math.random() < 0.5 ? this.player1Symbol : this.player2Symbol;
        this.displayMessage(`${this.currentPlayer === this.player1Symbol ? this.player1Name : this.player2Name} starts the game with "${this.currentPlayer}".`);
    
        if (!this.isHumanGame && this.currentPlayer === this.player2Symbol) {
          
            this.makeComputerMove();
        }
    }
    
    
    updateScores(winner) {
        if (winner === this.player1Symbol) {
            this.player1Score++;
        } else if (winner === this.player2Symbol) {
            this.player2Score++;
        }
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const player1NameEl = document.getElementById('player1-name');
        const player1ScoreEl = document.getElementById('player1-score');
        const player2NameEl = document.getElementById('player2-name');
        const player2ScoreEl = document.getElementById('player2-score');
      
        player1NameEl.textContent = this.player1Name;
        player1ScoreEl.textContent = `Score: ${this.player1Score}`;
        player2NameEl.textContent = this.player2Name;
        player2ScoreEl.textContent = `Score: ${this.player2Score}`;
    }
    
    getAvailablePositions() {
        return this.gameBoard.map((value, index) => (value === "" ? index : null)).filter((value) => value !== null);
    }
    
    makeComputerMove() {
        if (this.selectedPlayMode === "easy" || this.selectedPlayMode === "medium" || this.selectedPlayMode === "hard") {
            this.computerMove(this.selectedPlayMode);
        } else {
            console.error("Unknown play mode selected");
        }
    }
    
    computerMove(playMode) {
        let availablePositions = this.getAvailablePositions();
        if (availablePositions.length > 0) {
            let randomIndex = Math.floor(Math.random() * availablePositions.length);
            this.makeMove(availablePositions[randomIndex]);
        }
    }
    
        

    computerEasyMove() {
        let availablePositions = this.getAvailablePositions();
        if (availablePositions.length > 0) {
            let randomIndex = Math.floor(Math.random() * availablePositions.length);
            this.makeMove(availablePositions[randomIndex]);
        }
    }

    displayMessage(message) {
        const messageElement = document.querySelector(".turn");
        if (messageElement) {
            messageElement.innerText = message;
            messageElement.style.display = 'block'; 
        } else {
            console.error("The message element does not exist in the DOM.");
        }
    }
    
   

    makeMove(position) {
        if (this.gameBoard[position] === "") {
            this.gameBoard[position] = this.currentPlayer;
            this.updateBoardUI(position);
    

            if (this.checkWin(this.currentPlayer)) {
      
                this.displayMessage(`${this.currentPlayer} wins!`);
                this.updateScores(this.currentPlayer);
                this.highlightWinningLine(this.getWinningCombo(this.currentPlayer));
                this.disableBoard();
            } else if (this.isBoardFull()) {
                this.displayMessage("It's a draw!");
                this.disableBoard();
            } else {
                this.switchPlayer();
                if (!this.isHumanGame && this.currentPlayer === this.player2Symbol) {
                    this.makeAIMove();
                }
            }
        }
    }
    
    makeAIMove() {
        setTimeout(() => {
            if (this.selectedPlayMode === "easy") {
                this.computerEasyMove();
            } else if (this.selectedPlayMode === "medium") {
                this.computerMediumMove();
            } else if (this.selectedPlayMode === "hard") {
                this.computerHardMove();
            }
        }, 500);
    }
   
    getWinningCombo(player) {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
    
        for (let combo of winCombos) {
            if (combo.every(index => this.gameBoard[index] === player)) {
                return combo;
            }
        }
    
        return null; // No winning combo found
    }
     
     computerMediumMove() {
        if (Math.random() < 0.5) {
            this.computerEasyMove(); 
        } else {
            this.computerHardMove(); 
        }
    }
    computerHardMove() {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < this.gameBoard.length; i++) {
            if (this.gameBoard[i] === '') {
                this.gameBoard[i] = this.player2Symbol; // Assume the computer is player 2
                let score = this.minmax(this.gameBoard, 0, false);
                this.gameBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        this.makeMove(bestMove);
    }

    minmax(board, depth, isMaximizing) {
        if (this.checkWin(this.player1Symbol)) {
            return -10 + depth; 
        } else if (this.checkWin(this.player2Symbol)) {
            return 10 - depth; 
        } else if (this.isBoardFull()) {
            return 0; 
        }
    
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = this.player2Symbol;
                    let score = this.minmax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = this.player1Symbol;
                    let score = this.minmax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    updateBoardUI(position) {
    
        if (this.boardContainer.children.length !== 9) {
            return; 
        }
    
        const square = this.boardContainer.children[position];
        if (!square) {
            return; 
        }
     square.innerText = this.currentPlayer;
        square.classList.add(this.currentPlayer);
    }
    
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1Symbol ? this.player2Symbol : this.player1Symbol;
        const currentPlayerName = this.currentPlayer === this.player1Symbol ? this.player1Name : this.player2Name;
        this.displayMessage(`${currentPlayerName}'s turn (${this.currentPlayer}).`);
         
    }
    

    checkWin(player) {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
    
        for (let combo of winCombos) {
            if (combo.every(index => this.gameBoard[index] === player)) {
                return true;
            }
        }
        return false;
    }
    

    highlightWinningLine(combo) {
       
        combo.forEach(index => {

            const winningSquare = this.boardContainer.children[index];
            if (!winningSquare) {
                console.error('No winning square found at index:', index);
                return; 
            }
            winningSquare.style.backgroundColor = 'green'; 
        });
    }
    
    
    disableBoard() {
        this.boardContainer.removeEventListener("click", this.handleSquareClick);
    }

    handleSquareClick(event) {
        if (event.target.classList.contains("square")) {
            const squareIndex = Array.from(this.boardContainer.children).indexOf(event.target);
            this.makeMove(squareIndex);
        }
       
    }
}



// Create the board object once
const gameBoardContainer = document.querySelector(".game-board");
const board = new Board(gameBoardContainer);

document.addEventListener("DOMContentLoaded", function () {
    const playHumanButton = document.getElementById("play-human");
    const playComputerButton = document.getElementById("play-computer");
    const buttonsContainer = document.querySelector(".buttons-container");
    const playerInputsContainer = document.querySelector(".player-inputs");
    const computerInputsContainer = document.querySelector(".computer-inputs");
    const gameBoardContainer = document.querySelector(".game-board");
    const startHumanGameButton = document.getElementById("start-human-game");
    const errorMessage = document.querySelector(".error-message");
    const newGameButton = document.getElementById("new-game-button");
    const playerInfoContainer = document.querySelector('.game-board .player-info-container');

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", function (event) {
        event.preventDefault();
        board.reset();
        board.beginGame();
    });

    newGameButton.addEventListener("click", function () {
        location.reload();
    });

    playHumanButton.addEventListener("click", function () {
        board.isHumanGame = true;
        setupGame();
    });

    playComputerButton.addEventListener("click", function () {
        console.log("playComputerButton clicked"); // Add this line for debugging
        board.isHumanGame = false;
        setupGame();
    });
    
    function setupGame() {
        
        buttonsContainer.style.display = "none";
    
       
        playerInputsContainer.style.display = board.isHumanGame ? "block" : "none";
        computerInputsContainer.style.display = board.isHumanGame ? "none" : "block";
    
        board.reset();
    
        if (!board.isHumanGame) {
           
        }
    }
    

    startHumanGameButton.addEventListener("click", function () {
        const player1Name = document.getElementById("player1").value.trim();
        const player2Name = document.getElementById("player2").value.trim();

        if (player1Name && player2Name) {
            board.setPlayers(player1Name, player2Name);
            board.beginGame();
            displayErrorMessage("");
        } else {
            displayErrorMessage("Please enter names for both players.");
        }
    });

    function displayErrorMessage(message) {
        errorMessage.innerText = message;
        errorMessage.style.display = message ? 'block' : 'none';
    }

    const startComputerGameButton = document.getElementById("start-computer-game");

    startComputerGameButton.addEventListener("click", function () {
        const player1Name = document.getElementById("computer-player").value.trim();
        const selectedPlayMode = document.getElementById("play-mode").value;
    
        console.log("Selected Play Mode:", selectedPlayMode);

        if (player1Name) {
            board.setPlayers(player1Name, "Computer");
            board.selectedPlayMode = selectedPlayMode; 
            board.beginGame(); 
            displayErrorMessage(""); 
        } else {
            displayErrorMessage("Please enter your name.");
        }
    });
    
    
    
    
});


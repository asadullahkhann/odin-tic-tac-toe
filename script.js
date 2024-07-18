const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('button');
const lineEl = document.querySelector('.line');

const gameboard = (function() {
    let arr = new Array(9).fill(null);
    const setArr = (idx, val) => {
        arr[idx] = val;
    };
    const getArr = () => arr;
    const resetArr = () => {
        arr = arr.fill(null);
    };
    return {setArr, getArr, resetArr};
})();

const displayController = (function() {
    const updateVisualGameboard = (cell, choice) => {
        cells[cell].textContent = choice;
    };

    const drawLine = (cls) => {
        lineEl.style.visibility = 'visible';
        if(cls.includes('v')) {
            lineEl.classList.add('v-line', cls);
            return;
        }
        lineEl.classList.add(cls);
    };
    const reset = () => {
        cells.forEach(cell => {
            cell.textContent = '';
        });
        lineEl.style.visibility = 'hidden';
        lineEl.className = '';
        lineEl.classList.add('line');
    }
    return {updateVisualGameboard, drawLine, reset};
})();

function createPlayer(name, choice) {
    const playerName = name;
    const playerChoice = choice;
    function drawOnBoard(cell) {
        displayController.updateVisualGameboard(cell, this.playerChoice);
        gameboard.setArr(cell, this.playerChoice);
    }
    return {playerName, playerChoice, drawOnBoard};
}

function createCom(choice) {
    const {playerName, playerChoice} = createPlayer('Com', choice);
    const getRandomCell = () => {
        const indexesOfUnfilledCells = [];
        for(let i = 0; i < 9; i++) {
            if(gameboard.getArr()[i] === null) indexesOfUnfilledCells.push(i);
        }
        const randomIndexOfUnfilledCells = Math.floor(Math.random() * indexesOfUnfilledCells.length);
        return indexesOfUnfilledCells[randomIndexOfUnfilledCells];
        
    }
    function drawOnBoard() {
        let randomCell = getRandomCell();
        displayController.updateVisualGameboard(randomCell, this.playerChoice);
        gameboard.setArr(randomCell, this.playerChoice);
        cells[randomCell].onclick = null;
    }
    return {playerName, playerChoice, drawOnBoard};
};

const ticTacToe = (function() {
    const opponent = prompt('Who do you want to play against, Player 2 or Com?').toLowerCase();
    let player1;
    let player2;
    let com;
    let currentPlayer = 1;
    if(opponent === 'com') {
        player1 = createPlayer(prompt('Enter your name'), prompt('X or O').toLowerCase());
        const comChoice = player1.playerChoice === 'x' ? 'o' : 'x';
        com = createCom(comChoice);
    }
    else if(opponent === 'player 2') {
        player1 = createPlayer(prompt('Enter your name'), 'x');
        player2 = createPlayer(prompt("Enter player 2's name"), 'o')
    }
    const getResult = () => {
        const gameboardArr = gameboard.getArr();
        for(let i = 0; i < 9; i+=3) {
            if((gameboardArr[i] && gameboardArr[i+1] && gameboardArr[i+2]) && gameboardArr[i] === gameboardArr[i+1] && gameboardArr[i+1] === gameboardArr[i+2]) {
                return `${gameboardArr[i]} has won via h-line-${i}`;
            }
        }
        for(let i = 0; i < 3; i++) {
            if((gameboardArr[i] && gameboardArr[i+3] && gameboardArr[i+6]) && gameboardArr[i] === gameboardArr[i+3] && gameboardArr[i+3] === gameboardArr[i+6]) {
                return `${gameboardArr[i]} has won via v-line-${i}`;
            }
        }
        if((gameboardArr[0] && gameboardArr[4] && gameboardArr[8]) && gameboardArr[0] === gameboardArr[4] && gameboardArr[4] === gameboardArr[8]) {
            return `${gameboardArr[0]} has won via d-line-0`;
        }
        else if((gameboardArr[2] && gameboardArr[4] && gameboardArr[6]) && gameboardArr[2] === gameboardArr[4] && gameboardArr[4] === gameboardArr[6]) {
            return`${gameboardArr[2]} has won via d-line-2`;
        }
        else if(gameboardArr.filter(el => el === 'x' || el === 'o').length === 9) return "It's a draw!";

        return 'No result yet!';
    }

    function removeOnClickFromCells() {
        cells.forEach(cell => {
            cell.onclick = null;
        })
    }

    function handleDraw() {
        removeOnClickFromCells();
        setTimeout(() => {
            alert("It's a draw");
        }, 2000);
    }

    function handleWinning() {
        const resultArr = getResult().split(' ');
        displayController.drawLine(resultArr[resultArr.length - 1]);
        setTimeout(() => {
            alert(resultArr[0].toUpperCase() + ' has won');
        }, 2000);
        removeOnClickFromCells();
    }

    function handleOnClick(e) {
        if(opponent === 'com') {
            player1.drawOnBoard(+e.target.getAttribute('data-index'));
            e.target.onclick = null;
            if(getResult() === "It's a draw!") {
            handleDraw();
            }
            else if(getResult() !== 'No result yet!') {
           handleWinning();
            }
            else {
            com.drawOnBoard();
            if(getResult() === "It's a draw!") {
                handleDraw();
            }
            else if(getResult() !== 'No result yet!') {
                handleWinning();
            }
        }
        }
        else {
            if(currentPlayer === 1) {
                player1.drawOnBoard(+e.target.getAttribute('data-index'));
                e.target.onclick = null;
                currentPlayer = 2;
                if(getResult() === "It's a draw!") {
                        handleDraw();
                    }
                    else if(getResult() !== 'No result yet!') {
                        handleWinning();
                    }
            }
            else if(currentPlayer === 2) {
                player2.drawOnBoard(+e.target.getAttribute('data-index'));
                e.target.onclick = null;
                currentPlayer = 1;
                if(getResult() === "It's a draw!") {
                        handleDraw();
                    }
                    else if(getResult() !== 'No result yet!') {
                        handleWinning();
                    }
            }
        }
    };

    function startGame() {
        cells.forEach(cell => {
            cell.onclick = handleOnClick;
        });
        if(opponent === 'com' && com.playerChoice === 'x') {
            com.drawOnBoard();
        };
    }
    const resetGame = () => {
        currentPlayer = 1;
        gameboard.resetArr();
        displayController.reset();
        ticTacToe.startGame();
    };
    return {startGame, resetGame};
    })();

    ticTacToe.startGame();

    restartBtn.addEventListener('click', () => {
        ticTacToe.resetGame();
    })
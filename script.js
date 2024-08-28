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
    const updateVisualGameboard = () => {
        for(let i = 0; i < 9; i++) {
            if(gameboard.getArr()[i] === null) continue;
            cells[i].textContent = gameboard.getArr()[i];
        }
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
        gameboard.setArr(cell, this.playerChoice);
    }
    return {playerName, playerChoice, isCom: false, drawOnBoard};
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
        gameboard.setArr(randomCell, this.playerChoice);
        cells[randomCell].onclick = null;
    }
    return {playerName, playerChoice, isCom: true, drawOnBoard};
};

const players = (function() {
    const opponent = prompt('Who do you want to play against, Player 2 or Com?').toLowerCase();
    let player1;
    let player2;
    let currentPlayer = 1;
    if(opponent === 'com') {
        player1 = createPlayer(prompt('Enter your name'), prompt('X or O').toLowerCase());
        const comChoice = player1.playerChoice === 'x' ? 'o' : 'x';
        player2 = createCom(comChoice);
    }
    else if(opponent === 'player 2') {
        player1 = createPlayer(prompt('Enter your name'), 'x');
        player2 = createPlayer(prompt("Enter player 2's name"), 'o')
    }
    return {player1, player2, currentPlayer};
})();

const resultGetter = (function() {
    const getResult = () => {
        const gameboardArr = gameboard.getArr();
        let i = 0;
        let j = 0;
        while(j < 3) {
            const currantRow = gameboardArr.slice(i, i+3)
            if(currantRow.every(el => el === 'x') || 
            currantRow.every(el => el === 'o')) {
                return `${gameboardArr[i]} has won via h-line-${i}`;
            }
            const currantCol = gameboardArr.filter((el, idx) => idx === j || idx === j+3 || idx === j+6)
            if(currantCol.every(el => el === 'x') || currantCol.every(el => el === 'o')) {
                return `${gameboardArr[j]} has won via v-line-${j}`;
            }
            i+=3;
            j++;
        }
        let currDiagonalCol = gameboardArr.filter((el, idx) => idx === 0 || 
        idx === 4 || 
        idx === 8
        );
        if(currDiagonalCol.every(el => el === 'x') || currDiagonalCol.every(el => el === 'o')) {
            return `${gameboardArr[0]} has won via d-line-0`;
        }
        currDiagonalCol = gameboardArr.filter((el, idx) => idx === 2 ||
        idx === 4 || 
        idx === 6
        );
        if(currDiagonalCol.every(el => el === 'x') || currDiagonalCol.every(el => el === 'o')) {
            return`${gameboardArr[2]} has won via d-line-2`;
        }
        if(gameboardArr.every(el => el !== null)) return "It's a draw!";

        return 'No result yet!';
    };
    return {getResult};
})();

const resultHandler = (function() {
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
        const resultArr = resultGetter.getResult().split(' ');
        displayController.drawLine(resultArr[resultArr.length - 1]);
        setTimeout(() => {
            if(!players.player2.isCom) {
                resultArr[0] === 'x' ? alert(players.player1.playerName + ' has won') 
                : alert(players.player2.playerName + ' has won');
            }
            else {
                alert(resultArr[0].toUpperCase() + ' has won');
            }
        }, 2000);
        removeOnClickFromCells();
    };
    return {handleDraw, handleWinning};
})();

const onClickHandler = (function() {
    function handleOnClick(e) {
        e.target.onclick = null;
        if(players.player2.isCom) {
            players.player1.drawOnBoard(+e.target.getAttribute('data-index'));
            displayController.updateVisualGameboard();
            if(resultGetter.getResult() === "It's a draw!") {
                resultHandler.handleDraw();
            }
            else if(resultGetter.getResult() !== 'No result yet!') {
                resultHandler.handleWinning();
            }
            else {
                players.player2.drawOnBoard();
                displayController.updateVisualGameboard();
                if(resultGetter.getResult() === "It's a draw!") {
                resultHandler.handleDraw();
            }
                else if(resultGetter.getResult() !== 'No result yet!') {
                resultHandler.handleWinning();
            }
        }
        }
        else {
            if(players.currentPlayer === 1) {
                players.player1.drawOnBoard(+e.target.getAttribute('data-index'));
                displayController.updateVisualGameboard();
                players.currentPlayer = 2;
                if(resultGetter.getResult() === "It's a draw!") {
                    resultHandler.handleDraw();
                }
                else if(resultGetter.getResult() !== 'No result yet!') {
                    resultHandler.handleWinning();
                }
            }
            else if(players.currentPlayer === 2) {
                players.player2.drawOnBoard(+e.target.getAttribute('data-index'));
                displayController.updateVisualGameboard();
                players.currentPlayer = 1;
                if(resultGetter.getResult() === "It's a draw!") {
                        resultHandler.handleDraw();
                }
                else if(resultGetter.getResult() !== 'No result yet!') {
                        resultHandler.handleWinning();
                }
            }
        }
    };
    return {handleOnClick};
})();

const ticTacToe = (function() {
    function startGame() {
        if(players.player2.isCom && players.player2.playerChoice === 'x') {
            players.player2.drawOnBoard();
            displayController.updateVisualGameboard();
        };
    }
    const resetGame = () => {
        players.currentPlayer = 1;
        gameboard.resetArr();
        displayController.reset();
        ticTacToe.startGame();
    };
    return {startGame, resetGame};
})();

cells.forEach(cell => {
    cell.onclick = onClickHandler.handleOnClick;
});

restartBtn.addEventListener('click', () => {
        cells.forEach(cell => {
            cell.onclick = onClickHandler.handleOnClick;
        });
        ticTacToe.resetGame();
});

ticTacToe.startGame();
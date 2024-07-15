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
        if(cls.includes('v')) {
            lineEl.classList.add('v-line', cls);
            lineEl.style.visibility = 'visible';
            return;
        }
        lineEl.classList.add(cls);
        lineEl.style.visibility = 'visible';
    };
    const reset = () => {
        cells.forEach(cell => {
            cell.textContent = '';
        });
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
    const player1 = createPlayer(prompt('Enter your name'), prompt('X or O'));
    const comChoice = player1.playerChoice === 'x' ? 'o' : 'x';
    const com = createCom(comChoice);
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

    function handleWinning() {
        const resultArr = getResult().split(' ');
        displayController.drawLine(resultArr[resultArr.length - 1]);
        setTimeout(() => {
            alert(resultArr[0].toUpperCase() + ' has won');
        }, 2000);
        cells.forEach(cell => {
            cell.onclick = null;
        });
    }

    function startGame() {
        if(com.playerChoice === 'x') {
            com.drawOnBoard();
        }
        cells.forEach(cell => {
            cell.onclick = (e) => {
                player1.drawOnBoard(+e.target.getAttribute('data-index'));
                e.target.onclick = null;
                if(getResult() === "It's a draw!") {
                    alert("It's a draw!");
                    cells.forEach(cell => {
                        cell.onclick = null;
                    });
                }
                else if(getResult() !== 'No result yet!') {
                   handleWinning();
                }
                else {
                    com.drawOnBoard();
                    if(getResult() === "It's a draw!") {
                        alert("It's a draw!");
                        cells.forEach(cell => {
                            cell.onclick = null;
                        });
                    }
                    else if(getResult() !== 'No result yet!') {
                        handleWinning();
                    }
                }
            }
        })
    }
    const resetGame = () => gameboard.resetArr();
    return {startGame, resetGame};
    })();

    ticTacToe.startGame();
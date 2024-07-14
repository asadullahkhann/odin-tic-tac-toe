const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('button');
const lineEl = document.querySelector('.line');

const gameboard = (function() {
    let arr = [null, null, null, null, null, null, null, null, null];
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
            return;
            lineEl.style.visibility = 'visible';
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
})

function createPlayer(name, choice) {
    const playerName = name;
    const playerChoice = choice;
    function drawOnBoard() {
        let cell = prompt('Which cell?');
        while(gameboard.getArr()[+cell] !== null) {
            cell = prompt('Already filled, try another cell');    
        }
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
        gameboard.setArr(randomCell, this.playerChoice);
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
                return `${gameboardArr[i]} has won!`;
            }
        }
        for(let i = 0; i < 3; i++) {
            if((gameboardArr[i] && gameboardArr[i+3] && gameboardArr[i+6]) && gameboardArr[i] === gameboardArr[i+3] && gameboardArr[i+3] === gameboardArr[i+6]) {
                return `${gameboardArr[i]} has won!`;
            }
        }
        if((gameboardArr[0] && gameboardArr[4] && gameboardArr[8]) && gameboardArr[0] === gameboardArr[4] && gameboardArr[4] === gameboardArr[8]) {
            return `${gameboardArr[0]} has won!`;
        }
        else if((gameboardArr[2] && gameboardArr[4] && gameboardArr[6]) && gameboardArr[2] === gameboardArr[4] && gameboardArr[4] === gameboardArr[6]) {
            return`${gameboardArr[2]} has won!`;
        }
        else if(gameboardArr.filter(el => el === 'x' || el === 'o').length === 9) return "It's a draw!";

        return 'No result yet!';
    }

    function startGame() {
        while(true) {
            if(player1.playerChoice === 'x') {
                player1.drawOnBoard();
                if(getResult() !== 'No result yet!') {
                break;
            }
                com.drawOnBoard();
            }
            else {
                com.drawOnBoard();
                if(getResult() !== 'No result yet!') {
                break;
            }
                player1.drawOnBoard();
            }
        }
        return getResult();
    }
    const resetGame = () => gameboard.resetArr();
    return {startGame, resetGame};
    })();
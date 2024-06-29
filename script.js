const gameboard = (function() {
    const arr = new Array(9);
    const setArr = (idx, val) => {
        arr[idx] = val;
    };
    const getArr = () => arr;
    return {setArr, getArr};
})();

function createPlayer(name, choice) {
    const playerName = name;
    const playerChoice = choice;
    function drawOnBoard(cell) {
        gameboard.setArr(cell, this.playerChoice)
    }
    return {playerName, playerChoice, drawOnBoard};
}

const com = (function(choice) {
    const {playerName, playerChoice} = createPlayer('Com', choice);
    function drawOnBoard() {

    }

})
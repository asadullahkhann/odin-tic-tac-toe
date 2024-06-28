const gameboard = (function() {
    const arr = [];
    const setArr = (idx, val) => {
        arr[idx] = val;
    };
    const getArr = () => arr;
    return {setArr, getArr};
})();
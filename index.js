const fieldTaken = 'fa-solid'; // instead of a booleon I will check for a class name

const drawX = 'fa-xmark';   // class name that draws 'x'
const drawO = 'fa-o';       // class name that draws 'o'


let playerPC = 'X';
let playerHU = 'O';

let startingPlayer = playerHU;
let currentPlayer;

// array holding still available values
let availableValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// matrix containing 'magic square' values for the game
const mainValueMap=[
    [8, 1, 6],
    [3, 5, 7],
    [4, 9, 2]
];
const shadowValueMap=[
    [8, 1, 6],
    [3, 5, 7],
    [4, 9, 2]
];

// matrix to log player choice
let playerMap=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
const userMinimaxMap=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
// matrix to log PC choice
let pcMap=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
const pcMinimaxMap=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

function asignMinimaxMap(boardMap, minimaxMap){
    for (let y = 0; y < 3; y++){
        for (let x = 0; x < 3; x++){
            minimaxMap[x][y] = boardMap[x][y];
        }
    }
}

function pickBestMove() {
    let bestScore = -100;
    let bestMove;
    let shadowCopy = pcMap.slice();
    for (let y = 0; y < 3; y++){
        for (let x = 0; x < 3; x++){
        
            if (availableValues.includes(mainValueMap[x][y])){
                shadowCopy[x][y] =  mainValueMap[x][y];
                let score = minimax(mainValueMap, 0, false);
                if (score > bestScore){
                    bestScore = score;
                    bestMove = {x, y};
                }
            }
        }
    }
    pcMap[bestMove.x][bestMove.y] = mainValueMap[bestMove.x][bestMove.y];
    console.log('pc selected: ' + pcMap[bestMove.x][bestMove.y]);
    // draws pc move
    let pcMove = pcMap[bestMove.x][bestMove.y];
    fieldGrid.forEach(function (i) {
        if (i.value == pcMove){
            i.classList.add(fieldTaken);
            i.classList.add(drawX);
        }
    })
    // edits availabe values array and pcMap matrix
    updateMap(pcMap, pcMove);
    currentPlayer = playerHU;
    whosTurnIsIt(currentPlayer);
}
function minimax(boardMap, depth, isMaximizing){
    // let shadowCopy = pcMap.slice();
    // let results = checkScore(pcMap);
    if (checkScore(pcMap) !== null){
        return checkScore(pcMap);
    }
    if (isMaximizing){
        let bestScore = -Infinity;
        for (let y = 0; y < mainValueMap.length; y++){ 
            for (let x = 0; x < mainValueMap.length; x++){
                if (availableValues.includes(mainValueMap[x][y])){
                    shadowCopy[x][y] =  mainValueMap[x][y];
                    let score = minimax(boardMap, depth + 1, false);
                    bestScore = max(bestScore, score);
                }
            }
        }
        console.log('best score is: ' + bestScore);
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let y = 0; y < mainValueMap.length; y++){ 
            for (let x = 0; x < mainValueMap.length; x++){
                if (availableValues.includes(mainValueMap[x][y])){
                    shadowCopy[x][y] =  mainValueMap[x][y];
                    let score = minimax(boardMap, depth + 1, true);
                    bestScore = min(bestScore, score);
                }
            }
        }
        console.log('best score is: ' + bestScore);
        return bestScore;
    }
    
}


function whosTurnIsIt(currentPlayer){
    console.log(`it is players ${currentPlayer} turn`)
}


let scores = {
    X: 10,
    O: -10,
    tie: 0
  };




function checkScore(boardMap) {
    let winner = null;

    let rowSum = boardMap.map(r => r.reduce( (a, b) => a + b ));
    let colSum = boardMap.reduce((a, b) => a.map((x, i) => x + b[i]));
   
    let diagSum0 = 0;
    let diagSum3 = 0;
    // diagonal sum
    for (let i = 0; i < 3; i++){
        diagSum0 += boardMap[i][i];
        diagSum3 += boardMap[i][2-i];
    }

    if (rowSum.includes(15) || colSum.includes(15) || diagSum0 === 15 || diagSum3 === 15) {
        if (currentPlayer = playerPC){
            score = 10;
            winner = currentPlayer;
            console.log(`player ${winner} has won!!!`);
            return score;
        }
        else if (currentPlayer = playerHU){
            score = -10;
            winner = currentPlayer;
            console.log(`player ${winner} has won!!!`);
            return score;
        }
    }
    else if (winner == null && availableValues.length == 0){
        score = 0;
        console.log('it a tie');
        return score;
    }
}




function updateMap(boardMap, value) {
    
    for (let y = 0; y < 3; y++){ 
        for (let x = 0; x < 3; x++){
            if (mainValueMap[x][y] == value){
                // add field into his own matrix
                boardMap[x][y] = value;
                // marks field with his sign in main map
                // mainValueMap[x][y] = currentPlayer;
            }
        }
    }
    
    // getting rid off value that was picked form availabeValues array
    for (let x = 0; x < availableValues.length; x++){
        if (availableValues[x] == value ){
            console.log('removing value: ' + availableValues[x]);
            availableValues.splice(x, 1);
        }
    }
    console.log('still available values: ' + availableValues);
}


var playerPickedValue;
const fieldGrid = document.querySelectorAll('.field');
fieldGrid.forEach(function (i) {
    i.addEventListener('click', function (){
        
        currentPlayer = startingPlayer;
        if (currentPlayer == playerHU){
            if (this.classList.contains(fieldTaken) === false) {
                this.classList.add(fieldTaken);
                this.classList.add(drawO);
                playerPickedValue = this.value;

                updateMap(playerMap, playerPickedValue);
                console.log(playerMap);
                console.log(mainValueMap);
                checkScore(playerMap);
                

                currentPlayer = playerPC;
                whosTurnIsIt(currentPlayer);
                pickBestMove();
            }
        }
    })
})
function whosTurnIsIt(currentPlayer){
    console.log(`it is players ${currentPlayer} turn`)
}


pickBestMove();
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

// matrix to log player choice
let playerMap=[  
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

function pickBestMove() {
    let bestScore = -100;
    let bestMove;
    for (let y = 0; y < 3; y++){
        for (let x = 0; x < 3; x++){
            if (availableValues.includes(mainValueMap[x][y])){
                pcMap[x][y] =  mainValueMap[x][y];   
                let score = minimax(mainValueMap, 0, false);
                pcMap[x][y] = 0;
                if (score > bestScore){
                    bestScore = score;
                    bestMove = {x, y};
                    console.log('best move is: ' + bestMove.x + ' ' + bestMove.y);
                }
            }
        }
    }
    console.log('best score is: ' + bestScore);
    console.log('pc selected: ' + pcMap[bestMove.x][bestMove.y]);
    // draws pc move
    let pcMove = mainValueMap[bestMove.x][bestMove.y];
 
    fieldGrid.forEach(function (i) {
        if (i.value == pcMove){
            i.classList.add(fieldTaken);
            i.classList.add(drawX);
        }
    })
    // edits availabe values array and pcMap matrix
    updateMap(pcMap, pcMove);
    // mainValueMap[bestMove.x][bestMove.y] = playerPC;
    console.log(pcMap);
    currentPlayer = playerHU;
    whosTurnIsIt(currentPlayer);
}
function minimax(boardMap, depth, isMaximizing){

    if (checkScore() != null || availableValues.length != 0){
        if (winner = playerHU){
            return 100 - depth;
        }
        else if (winner = playerPC){
            return -100 + depth;
        }
        return 0;
    }

    if (isMaximizing){
        let bestScore = -Infinity;
        for (let y = 0; y < 3; y++){ 
            for (let x = 0; x < 3; x++){
                if (availableValues.includes(mainValueMap[x][y])){
                    pcMap[x][y] = mainValueMap[x][y];
                    let score = minimax(boardMap, depth + 1, false);
                    pcMap[x][y] = 0;
                    bestScore = max(bestScore, score);
                    console.log('best score is: ' + bestScore);
                }
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let y = 0; y < 3; y++){ 
            for (let x = 0; x < 3; x++){
                if (availableValues.includes(mainValueMap[x][y])){
                    playerMap[x][y] = mainValueMap[x][y];
                    let score = minimax(boardMap, depth + 1, true);
                    playerMap[x][y] = 0;
                    bestScore = min(bestScore, score);
                    console.log('best score is: ' + bestScore);
                }
            }
        }
        return bestScore;
    }
    
}




function whosTurnIsIt(currentPlayer){
    console.log(`it is players ${currentPlayer} turn`)
}


function updateMap(boardMap, value) {
    
    for (let y = 0; y < 3; y++){ 
        for (let x = 0; x < 3; x++){
            if (mainValueMap[x][y] == value){
                // add value into his own matrix in specific position
                boardMap[x][y] = value;
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
                playerPickedValue = JSON.parse(this.value);


                updateMap(playerMap, playerPickedValue);
                console.log(playerMap);
                checkScore();
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


function checkScore(boardName, playerName){
    let winner = null;

    let rowSumHU = playerMap.map(r => r.reduce( (a, b) => a + b ));
    let colSumHU = playerMap.reduce((a, b) => a.map((x, i) => x + b[i]));
    let rowSumPC = pcMap.map(r => r.reduce( (a, b) => a + b ));
    let colSumPC = pcMap.reduce((a, b) => a.map((x, i) => x + b[i]));
   
    let diagSumHU = [0, 0];
    let diagSumPC = [0, 0];


    for (let i = 0; i < 3; i++){
        diagSumHU[0] += playerMap[i][i];
        diagSumHU[1] += playerMap[i][2-i];
    }
    for (let i = 0; i < 3; i++){
        diagSumPC[0] += pcMap[i][i];
        diagSumPC[1] += pcMap[i][2-i];
    }


    if (rowSumHU.includes(15) || colSumHU.includes(15) || diagSumHU.includes(15)) {
        winner = playerHU;
        return -10;
    }
    if (rowSumPC.includes(15) || colSumPC.includes(15) || diagSumPC.includes(15)) {
        winner = playerPC;
        return 10;
    }
    else if (winner == null && availableValues.length == 0){
        winner = 'tie';
        return 0;
    }
}
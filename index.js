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
    let shadowCopy = pcMap.slice();
    for (let y = 0; y < 3; y++){
        for (let x = 0; x < 3; x++){
        
            if (availableValues.includes(mainValueMap[x][y])){
                shadowCopy[x][y] =  mainValueMap[x][y];
                let score = minimax(mainValueMap, 0, false);
                if (score > bestScore){
                    bestScore = score;
                    bestMove = {x, y};
                    console.log('best move is: ' + bestMove.x + ' ' + bestMove.y);
                }
            }
        }
    }
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
 
  // let results = checkScore(pcMap);
    if (checkScore(pcMap) !== null){
        return checkScore(pcMap);
    }


    if (isMaximizing){
        let bestScore = -100;
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
        let bestScore = 100;
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
                checkScore();
                console.log('player matrix' + playerMap);
                console.log('pc matrix: ' + pcMap);

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




function checkScore(){
    let winner = null;

    let rowSumHU = playerMap.map(r => r.reduce( (a, b) => a + b ));
    let colSumHU = playerMap.reduce((a, b) => a.map((x, i) => x + b[i]));
    let rowSumPC = pcMap.map(r => r.reduce( (a, b) => a + b ));
    let colSumPC = pcMap.reduce((a, b) => a.map((x, i) => x + b[i]));
   
    let diagSum0HU = 0;
    let diagSum3HU = 0;
    let diagSum0PC = 0;
    let diagSum3PC = 0;

    for (let i = 0; i < 3; i++){
        diagSum0HU += playerMap[i][i];
        diagSum3HU += playerMap[i][2-i];
    }
    for (let i = 0; i < 3; i++){
        diagSum0PC += pcMap[i][i];
        diagSum3PC += pcMap[i][2-i];
    }


    if (rowSumHU.includes(15) || colSumHU.includes(15) || diagSum0HU === 15 || diagSum3HU === 15) {
        winner = playerHU;
        return -10;
    }
    if (rowSumPC.includes(15) || colSumPC.includes(15) || diagSum0PC === 15 || diagSum3PC === 15) {
        winner = playerPC;
        return 10;
    }
    else if (winner == null && availableValues.length == 0){
        winner = 'tie';
        return 0;
    }
}

pickBestMove();
console.log(pcMap);
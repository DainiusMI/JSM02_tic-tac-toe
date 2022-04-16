const fieldTaken = 'fa-solid'; // instead of a booleon I will check for a class name

const drawX = 'fa-xmark';   // class name that draws 'x'
const drawO = 'fa-o';       // class name that draws 'o'

let won = false;     // has the gae been won

// matrix containing 'magic square' values 
const fieldMatrix=[
    [8, 1, 6],
    [3, 5, 7],
    [4, 9, 2]
];
// matrix to log player selection
const userMatrix=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
const pcOptionMatrix=[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
const pcChoiceMatrix=[  
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
// array of already used indexes
let movesLog = new Map();
console.log(movesLog);

// minimax algorithm
function evaluateScore(string){
    // putting used indexes into a string
    let value = movesLog.get(string);
    // checking if the created string is not empty
    if (value === undefined) {

        // testing if you have won bellow

        // splitting the argument string into seperate values and putting it in array
        let movesArray = string.split("").map(function(x) {return parseInt(x, 10);});
        // setting value to: 15 - last move value
        let compareResult = 15 - movesArray[string.length - 1];
        
        // Conditional (ternary) operator: 'condition ? true : false' ;
        // in this case we check if string length has a remainder
        // and asign 1 if it hasn't
        for (let i = (string.length % 2 == 0 ? 1 : 0); i < string.length - 4; i += 2) {
            for (let j = i + 2; j < string.length - 2; j += 2) {
                if (movesArray[i] + movesArray[j] == compareResult) {
                movesLog.set(string, 10 - string.length);
                return (10 - string.length);
                }
            }
        }
        // function argument has reached 9 characters "it's a draw"
        if (string.length == 9) {
            movesLog.set(string, 0);
            return 0;
        }
        // min of negative possible next results otherwise
        value = 10;
        for (let i = 1; i < 10; i++) {
            let newChar = i.toString();
            if (!string.includes(newChar)) {
                let curr = -evaluateString(string + newChar);
                if (curr < value)
                value = curr;
            }
        }
        evaluations.set(string, value);
    }
    return value;
}






const fieldGrid = document.querySelectorAll('.field');
fieldGrid.forEach(function (i) {
    i.addEventListener('click', function (){

        if (this.classList.contains(fieldTaken) === false) {
            this.classList.add(fieldTaken);
            this.classList.add(drawO);
            let fieldValue = JSON.parse(this.value);
        

            // since other solutions of finding index did not work using a for loop
            for (let y = 0; y < fieldMatrix.length; y++){ 
                for (let x = 0; x < fieldMatrix.length; x++){
                    if (fieldMatrix[x][y] === fieldValue){
                        userMatrix[x][y] = fieldValue;
                        pcOptionMatrix[x][y] = 0;
                    }
                }
            }
            // run pc move
            pcTurn();
          

        }
        checkScore(userMatrix);
    })
})

function pcTurn() {

    for (let x = 0; x < userMatrix.length; x++){
        if (userMatrix[x][x] == 0) {
            pcChoiceMatrix[x][x] == fieldMatrix[x][x];

        }
    }
}

function checkScore(mtx) {
    let rowSum = mtx.map(r => r.reduce( (a, b) => a + b ));
    let colSum = mtx.reduce((a, b) => a.map((x, i) => x + b[i]));
    let diagSum0 = 0;
    let diagSum3 = 0;
    // diagonal sum
    for (let i = 0; i < mtx.length; i++){
        diagSum0 += mtx[i][i];
        diagSum3 += mtx[i][mtx.length-i-1];
    }
    if (rowSum.includes(15) || colSum.includes(15) || diagSum0 === 15 || diagSum3 === 15) {
        won = true;
    }
}
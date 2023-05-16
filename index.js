const playArea = document.querySelector(".play-area");
const scoreBoard = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const timeCount = document.querySelector(".timer");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX = 5, foodY = 5;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let time = 0;

//Get High-scores
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`; 


//Pass a random position value between 1 and 30 for food positon
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random()*30) + 1;
    foodY = Math.floor(Math.random()*30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pres OK to replay...");
    location.reload();
}

//change velocity value based on key press
const changeDirection = e => {
    if(e.key === "UpArrow" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.key === "DownArrow" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.key === "LeftArrow" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.key === "RightArrow" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

//change direction on each key click
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const stopWatch = () => {
    time++; //time incrementing by 1 second
    timeCount.innerText = `Time: ${time}`; //shows the current run time
}

const initGame = () => {
    if(gameOver){
        time = 0;
        return handleGameOver();
    }

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    // When snake eat food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); //Add food to snake body array
        score++;
        highScore = score >= highScore ? score : highScore; // if score > high score => high score = score
        
        localStorage.setItem("high-score", highScore);
        scoreBoard.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
        
    }

    // Update Snake Head
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifthing forward values of elements in snake body by one

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Check snake body is out of wall or no

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Add div for each part of snake body

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Check snake head hit body or no
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playArea.innerHTML = html;
}


updateFoodPosition();
setIntervalId = setInterval(stopWatch, 1000);
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
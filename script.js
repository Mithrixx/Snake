const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const easyBtn = document.getElementById('easy');
const mediumBtn = document.getElementById('medium');
const hardBtn = document.getElementById('hard');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const controls = document.getElementById('controls');

const box = 20;
let snake = [];
let food = {};
let score = 0;
let d;
let game;
let gameSpeed;
let isGameOver = false;

easyBtn.addEventListener('click', () => startGame(150));
mediumBtn.addEventListener('click', () => startGame(100));
hardBtn.addEventListener('click', () => startGame(50));
restartButton.addEventListener('click', restartGame);
document.addEventListener("keydown", direction);
document.getElementById("up").addEventListener("click", () => { if(d != "DOWN") d = "UP"; });
document.getElementById("down").addEventListener("click", () => { if(d != "UP") d = "DOWN"; });
document.getElementById("left").addEventListener("click", () => { if(d != "RIGHT") d = "LEFT"; });
document.getElementById("right").addEventListener("click", () => { if(d != "LEFT") d = "RIGHT"; });


function startGame(speed) {
    gameSpeed = speed;
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    scoreDisplay.style.display = 'block';
    if (isMobile()) {
        controls.style.display = 'grid';
    }
    initGame();
}

function initGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * 15) * box,
        y: Math.floor(Math.random() * 15) * box
    };
    score = 0;
    d = undefined;
    isGameOver = false;
    scoreDisplay.innerText = "Score: " + score;
    if(game) clearInterval(game);
    game = setInterval(draw, gameSpeed);
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    initGame();
}

function direction(event) {
    let key = event.keyCode;
    if (isGameOver && key === 13) {
        restartGame();
        return;
    }

    if (!isGameOver) {
        if ((key == 37 || key == 65) && d != "RIGHT") {
            d = "LEFT";
        } else if ((key == 38 || key == 87) && d != "DOWN") {
            d = "UP";
        } else if ((key == 39 || key == 68) && d != "LEFT") {
            d = "RIGHT";
        } else if ((key == 40 || key == 83) && d != "UP") {
            d = "DOWN";
        }
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00ff00" : "#ffffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreDisplay.innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 15) * box,
            y: Math.floor(Math.random() * 15) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        isGameOver = true;
        finalScoreDisplay.innerText = "Final Score: " + score;
        gameOverScreen.style.display = 'flex';
        return;
    }

    snake.unshift(newHead);
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

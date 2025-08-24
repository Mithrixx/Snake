const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');
const controls = document.getElementById('controls');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 15) * box,
    y: Math.floor(Math.random() * 15) * box
};

let score = 0;
let d;
let isGameOver = false;

document.addEventListener("keydown", direction);
document.getElementById("up").addEventListener("click", () => { if(d != "DOWN") d = "UP"; });
document.getElementById("down").addEventListener("click", () => { if(d != "UP") d = "DOWN"; });
document.getElementById("left").addEventListener("click", () => { if(d != "RIGHT") d = "LEFT"; });
document.getElementById("right").addEventListener("click", () => { if(d != "LEFT") d = "RIGHT"; });
restartButton.addEventListener('click', restartGame);

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
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
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
        gameOverScreen.style.display = 'flex';
        isGameOver = true;
        return;
    }

    snake.unshift(newHead);

    ctx.fillStyle = "black";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

let game = setInterval(draw, 100);

function restartGame() {
    isGameOver = false;
    gameOverScreen.style.display = 'none';
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * 15) * box,
        y: Math.floor(Math.random() * 15) * box
    };
    score = 0;
    d = undefined;
    game = setInterval(draw, 100);
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    controls.style.display = 'grid';
}

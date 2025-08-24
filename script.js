const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const settingsScreen = document.getElementById('settingsScreen');
const easyBtn = document.getElementById('easy');
const mediumBtn = document.getElementById('medium');
const hardBtn = document.getElementById('hard');
const backButton = document.getElementById('backButton');
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
let gameSpeed = 100; // Default to medium
let isGameOver = false;

let lastUpdateTime = 0;
let gameLoopId;
let particles = [];

startButton.addEventListener('click', () => startGame(gameSpeed));
settingsButton.addEventListener('click', showSettings);
backButton.addEventListener('click', hideSettings);
easyBtn.addEventListener('click', () => setDifficulty(150));
mediumBtn.addEventListener('click', () => setDifficulty(100));
hardBtn.addEventListener('click', () => setDifficulty(50));
restartButton.addEventListener('click', restartGame);
document.addEventListener("keydown", direction);
document.getElementById("up").addEventListener("click", () => { if(d != "DOWN") d = "UP"; });
document.getElementById("down").addEventListener("click", () => { if(d != "UP") d = "DOWN"; });
document.getElementById("left").addEventListener("click", () => { if(d != "RIGHT") d = "LEFT"; });
document.getElementById("right").addEventListener("click", () => { if(d != "LEFT") d = "RIGHT"; });

function setDifficulty(speed) {
    gameSpeed = speed;
    document.querySelectorAll('#difficulty button').forEach(btn => btn.style.backgroundColor = 'transparent');
    if (speed === 150) easyBtn.style.backgroundColor = 'rgba(255,255,255,0.3)';
    if (speed === 100) mediumBtn.style.backgroundColor = 'rgba(255,255,255,0.3)';
    if (speed === 50) hardBtn.style.backgroundColor = 'rgba(255,255,255,0.3)';
}

function showSettings() {
    startScreen.style.display = 'none';
    settingsScreen.style.display = 'flex';
}

function hideSettings() {
    settingsScreen.style.display = 'none';
    startScreen.style.display = 'flex';
}

function startGame(speed) {
    gameSpeed = speed;
    startScreen.style.display = 'none';
    settingsScreen.style.display = 'none';
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
    particles = [];
    scoreDisplay.innerText = "Score: " + score;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    lastUpdateTime = 0;
    gameLoopId = requestAnimationFrame(gameLoop);
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'flex';
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

function update() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreDisplay.innerText = "Score: " + score;
        explode(food.x + box / 2, food.y + box / 2);
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
        isGameOver = true;
        finalScoreDisplay.innerText = "Final Score: " + score;
        gameOverScreen.style.display = 'flex';
        cancelAnimationFrame(gameLoopId);
        return;
    }

    snake.unshift(newHead);
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

    particles.forEach(p => p.draw());
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function handleParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function gameLoop(currentTime) {
    if (isGameOver) return;

    gameLoopId = requestAnimationFrame(gameLoop);

    handleParticles();
    draw();

    const deltaTime = currentTime - lastUpdateTime;
    if (deltaTime < gameSpeed) return;

    lastUpdateTime = currentTime;
    update();
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.color = `hsl(${Math.random() * 60}, 100%, 50%)`;
        this.life = 100;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function explode(x, y) {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y));
    }
}

document.getElementById('version').innerText = 'v08242025.1';

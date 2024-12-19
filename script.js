const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Modal handling
const modal = document.getElementById("modal");
const humanBtn = document.getElementById("human-btn");
const aiBtn = document.getElementById("ai-btn");
let isAIPlayer = false;

// Canvas setup
canvas.width = 800;
canvas.height = 400;

// Paddle settings
const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = 4;

// Ball settings
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

// Player paddles
const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
const player2 = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
};

// Movement
let player1Direction = 0;
let player2Direction = 0;

// Event listeners for desktop
document.addEventListener("keydown", (e) => {
  if (e.key === "w") player1Direction = -1;
  if (e.key === "s") player1Direction = 1;
  if (!isAIPlayer) {
    if (e.key === "ArrowUp") player2Direction = -1;
    if (e.key === "ArrowDown") player2Direction = 1;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") player1Direction = 0;
  if (!isAIPlayer && (e.key === "ArrowUp" || e.key === "ArrowDown"))
    player2Direction = 0;
});

// Touch controls for mobile
canvas.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();

  if (touch.clientX < rect.width / 2) {
    player1.y = touch.clientY - rect.top - paddleHeight / 2;
  } else if (!isAIPlayer) {
    player2.y = touch.clientY - rect.top - paddleHeight / 2;
  }
});

// AI behavior
function moveAI() {
  const centerY = player2.y + paddleHeight / 2;
  if (centerY < ballY) player2.y += paddleSpeed;
  if (centerY > ballY) player2.y -= paddleSpeed;

  // Prevent AI paddle from going out of bounds
  player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "white";
  ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
  ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with walls
  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  // Ball collision with paddles
  if (
    ballX - ballSize <= player1.x + paddleWidth &&
    ballY >= player1.y &&
    ballY <= player1.y + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX + ballSize >= player2.x &&
    ballY >= player2.y &&
    ballY <= player2.y + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball reset if out of bounds
  if (ballX <= 0 || ballX >= canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
  }

  // Update paddle positions
  player1.y += player1Direction * paddleSpeed;
  if (!isAIPlayer) {
    player2.y += player2Direction * paddleSpeed;
    player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));
  } else {
    moveAI();
  }

  // Prevent paddles from going out of bounds
  player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));

  requestAnimationFrame(gameLoop);
}

// Start game after modal choice
humanBtn.addEventListener("click", () => {
  isAIPlayer = false;
  modal.style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  gameLoop();
});

aiBtn.addEventListener("click", () => {
  isAIPlayer = true;
  modal.style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  gameLoop();
});

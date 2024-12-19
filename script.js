const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initial modal elements
const modal = document.getElementById("modal");
const humanBtn = document.getElementById("human-btn");
const aiBtn = document.getElementById("ai-btn");
const speedButtons = document.querySelectorAll(".speed-btn");
const startGameBtn = document.getElementById("start-game-btn");

// Result modal and button
const resultModal = document.getElementById("result-modal");
const resultMessageEl = document.getElementById("result-message");
const continueBtn = document.getElementById("continue-btn"); // Correct initialization

// Scoreboard elements
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");

// Game settings
let isAIPlayer = false;
let gameSpeed = 5; // Default speed
let player1Score = 0;
let player2Score = 0;
let isGameActive = false; // Flag to check if the game is active

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
let ballSpeedX = gameSpeed;
let ballSpeedY = gameSpeed;

// Player paddles
const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
const player2 = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
};

// Movement
let player1Direction = 0;
let player2Direction = 0;

// Event listeners for Player 2 mode
humanBtn.addEventListener("click", () => {
  isAIPlayer = false;
  humanBtn.classList.add("active");
  aiBtn.classList.remove("active");
  enableStartGameButton();
});

aiBtn.addEventListener("click", () => {
  isAIPlayer = true;
  aiBtn.classList.add("active");
  humanBtn.classList.remove("active");
  enableStartGameButton();
});

// Event listeners for speed selection
speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    gameSpeed =
      button.dataset.speed === "slow"
        ? 3
        : button.dataset.speed === "fast"
        ? 8
        : 5;
    speedButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    enableStartGameButton();
  });
});

// Enable start game button if both mode and speed are selected
function enableStartGameButton() {
  if (
    (humanBtn.classList.contains("active") ||
      aiBtn.classList.contains("active")) &&
    Array.from(speedButtons).some((btn) => btn.classList.contains("active"))
  ) {
    startGameBtn.disabled = false;
  }
}

// Event listener for start game
startGameBtn.addEventListener("click", () => {
  ballSpeedX = gameSpeed;
  ballSpeedY = gameSpeed;
  isGameActive = true; // Activate the game
  modal.style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  gameLoop(); // Start the game loop
});

// Event listener for the continue button to reset the modal and start a new game
continueBtn.addEventListener("click", () => {
  // Hide result modal and reset the initial modal
  resultModal.style.display = "none";
  modal.style.display = "flex";

  // Ensure the start game button is enabled if selections are made
  if (
    (humanBtn.classList.contains("active") ||
      aiBtn.classList.contains("active")) &&
    Array.from(speedButtons).some((btn) => btn.classList.contains("active"))
  ) {
    startGameBtn.disabled = false; // Enable the start game button
  }

  resetGame(); // Reset the game scores
});

// Reset the game and settings
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  isGameActive = false; // Stop the game
  updateScoreboard();
  humanBtn.classList.remove("active");
  aiBtn.classList.remove("active");
  speedButtons.forEach((btn) => btn.classList.remove("active"));
  startGameBtn.disabled = true; // Disable the start button until selections are made
}

// Scoring logic, ball reset, and game flow
function resetBall(winner) {
  if (winner === 1) player1Score++;
  else player2Score++;

  // Match ends if a player reaches 3 points
  if (player1Score >= 3 || player2Score >= 3) {
    resultMessageEl.textContent = `Player ${
      player1Score >= 3 ? 1 : 2
    } wins the match!`;
    resultModal.style.display = "flex"; // Show the result modal
    isGameActive = false; // Stop the game
    return;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1;
  updateScoreboard();
}

function updateScoreboard() {
  player1ScoreEl.textContent = `Player 1: ${player1Score}`;
  player2ScoreEl.textContent = `Player 2: ${player2Score}`;
}

// Desktop controls
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

// AI behavior
function moveAI() {
  const centerY = player2.y + paddleHeight / 2;
  if (centerY < ballY) player2.y += paddleSpeed;
  if (centerY > ballY) player2.y -= paddleSpeed;

  // Prevent AI paddle from going out of bounds
  player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));
}

function gameLoop() {
  if (!isGameActive) return; // Stop the game if it's not active

  // Update paddle positions
  player1.y += player1Direction * paddleSpeed;
  if (isAIPlayer) moveAI();
  else player2.y += player2Direction * paddleSpeed;

  // Prevent paddles from going out of bounds
  player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));

  // Update ball position
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  // Ball collision with paddles
  if (
    ballX <= player1.x + paddleWidth &&
    ballY >= player1.y &&
    ballY <= player1.y + paddleHeight
  ) {
    ballSpeedX *= -1;
  }
  if (
    ballX >= player2.x - ballSize &&
    ballY >= player2.y &&
    ballY <= player2.y + paddleHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball out of bounds
  if (ballX < 0) {
    resetBall(2);
  }
  if (ballX > canvas.width) {
    resetBall(1);
  }

  // Clear canvas and redraw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";

  // Draw paddles
  ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
  ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fill();

  // Request next frame
  requestAnimationFrame(gameLoop);
}

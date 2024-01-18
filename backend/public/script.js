const { body } = document;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const gameOverElem = document.createElement("div");
canvas.addEventListener("mousemove", movePaddle);
body.style.display = "flex";
body.style.justifyContent = "center";
body.style.alignItems = "center";
body.style.height = "100vh";
///////////////////////////////////
console.log("Connecting to backend....");
// /pong to connect specially to pong namespace
const socket = io("/pong");
let isRefree = false;

/////////////////////////////////////
// canvas height and width
const width = 500;
const height = 700;

// these will change later on
let paddleXBottom = 370;
let paddleXTop = 100;
let paddleHeight = 10;
let paddleWidth = 80;
// regarding ball
let ballX = 250;
let ballY = 350;
let ballRadius = 5;

// movement of the ball
let speed = 5;
let velocityX = 5;
let velocityY = 5;

// scores
let playerScore = 0;
let computerScore = 0;
let computerPaddleSpeed = 1;
let currentPosition;
let isGameOver = false;

function renderIntro() {
  // Canvas Background
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  // Intro Text
  context.fillStyle = "white";
  context.font = "32px Courier New";
  context.fillText("Waiting for opponent...", 20, canvas.height / 2 - 30);
}

function updateScore() {
  if (ballY + ballRadius > height) {
    computerScore++;
    console.log("Computer Scored");
    resetBall();
  } else if (ballY - ballRadius < 0) {
    computerPaddleSpeed += 1;
    playerScore++;
    console.log("Player Scored");
    resetBall();
  }
  socket.emit("scoreUpdate", { playerScore, computerScore });
}
function gameOver() {
  if (playerScore == 5 || computerScore == 5) {
    isGameOver = true;
    showGameOverScreen();
  }
}
let paddleDiff = 25;
function collisionPaddle(player) {
  // Corrected collision detection logic for bottom paddle
  if (ballY > height - paddleDiff) {
    if (ballX > paddleXBottom && ballX < paddleXBottom + paddleWidth) {
      // Collision detected
      currentPosition = ballX - (paddleXBottom + paddleWidth / 2);
      return true;
    }
  }
  // Corrected collision detection logic for top paddle
  if (ballY < paddleDiff) {
    if (ballX > paddleXTop && ballX < paddleXTop + paddleWidth) {
      // Collision detected
      currentPosition = ballX - (paddleXTop + paddleWidth / 2);
      console.log("Collision with top paddle");
      console.log(ballX, ballY);
      return true;
    }
  }
  return false; // Return false if no collision occurred
}

function resetBall() {
  ballX = width / 2; // Center the ball on the X-axis
  ballY = height / 2; // Center the ball on the Y-axis
  velocityX = 5;
  velocityY = 5;
  speed = 5;
  if (isRefree) {
    socket.emit("ballDetail", { ballX, ballY, velocityX, velocityY });
  }
  velocityX = 5; // Reset velocityX as well
  velocityY = -velocityY;
}

function collisionWall() {
  // Corrected the left wall collision check
  if (ballX + ballRadius >= width || ballX - ballRadius <= 0) {
    velocityX = -velocityX;
    console.log("Collision with wall");
    // console.log(ballX,ballY)
    // console.log()
  }
}

function update() {
  //updating the ball movement
  ballX += velocityX;
  ballY += velocityY;
  let player = ballX < canvas.height / 2 ? "comp" : "user";
  if (isRefree) {
    socket.emit("ballDetail", { ballX, ballY, velocityX, velocityY });
  }
  updateScore();
  // moveComputerPaddle();

  if (collisionPaddle(player)) {
    let direction = ballY < height / 2 ? 1 : -1; // Determine the direction based on ball position
    velocityY = direction * speed; // Update velocityY based on the speed and direction
    // Adjust velocityX based on where the ball hit the paddle
    velocityX = direction * speed * (currentPosition / (paddleWidth / 2));
    speed += 0.2; // Increase speed after each hit
    console.log("Collision with paddle. Direction:", direction);
  }
}

function movePaddle(e) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  // Adjust the paddle position so the mouse is at the center of the paddle
  paddleXBottom = mouseX - paddleWidth / 2;
  socket.emit("paddleDetail", { paddleXBottom, paddleXTop });

  // console.log("Mouse X:", mouseX);
}

function moveComputerPaddle() {
  // The y position of the center of the computer paddle
  let paddleCenter = paddleXTop + paddleHeight / 2;
  paddleXTop += (ballX - paddleCenter) * computerPaddleSpeed;
}

function createCanvas() {
  // drawing the layout
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  // drawing the actual 2d objects using canvas
  renderCanvas();
}
createCanvas();
function renderCanvas() {
  context.fillStyle = "grey";
  context.fillRect(0, 0, width, height);

  // making a bottom paddle and give white color to it
  context.fillStyle = "white";
  context.fillRect(paddleXBottom, height - 20, paddleWidth, paddleHeight);
  context.fillRect(paddleXTop, 10, paddleWidth, paddleHeight); // making a top paddle
  // make a seperator at middle
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350); // move the context to center of board
  context.lineTo(500, 350); // crate a line upto 0-500 on x axis
  context.strokeStyle = "pink";
  context.stroke();

  // make a circle at center initially
  context.beginPath();
  context.fillStyle = "white";
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fill();

  // showing score
  const play = isRefree ? "Host" : "Player";
  context.font = "32px Courier New";
  context.fillText(play, 20, canvas.height / 2 - 60);

  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}
function showGameOverScreen() {
  gameOverElem.innerHTML = "";

  body.removeChild(canvas);
  const textScreen = document.createElement("h1");
  textScreen.textContent =
    playerScore > computerScore ? "You Won !" : "You Lost";
  textScreen.style.color = "Green";
  const button = document.createElement("button");
  button.textContent = "Play Again";
  button.style.display = "block";
  button.style.margin = "20px auto";
  button.style.padding = "10px 20px";
  button.style.fontSize = "1.2em";
  gameOverElem.append(textScreen, button);

  document.body.appendChild(gameOverElem);

  button.addEventListener("click", () => {
    document.body.removeChild(gameOverElem);

    resetBall();
    playerScore = 0;
    computerScore = 0;
    isGameOver = false;
    game();
  });
}
function game() {
  body.appendChild(canvas);
  if (isRefree) {
    update(); //this will update all the movements, collision detection and score update
  }
  renderCanvas(); // then those are updated here
  collisionWall();

  gameOver();

  if (!isGameOver) {
    window.requestAnimationFrame(game);
  }
}
function loadGame() {
  renderIntro();
  socket.emit("ready");
}
loadGame();
socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("startGame", (refId) => {
  console.log("Refree is ", refId);
  isRefree = socket.id === refId;
  game();
});

socket.on("realBallDetail", (ballDetail) => {
  if (!isRefree) {
    // ballX = ballDetail.ballX;
    // ballY = ballDetail.ballY;
    velocityX = ballDetail.velocityX;
    velocityY = -ballDetail.velocityY;
    ballX += velocityX;
    ballY += velocityY;
    // console.log(ballX, ballY, velocityX, velocityY);
  }
});
socket.on("realpaddleDetail", (paddleDetail) => {
  paddleXBottom = paddleDetail.paddleXTop;
  paddleXTop = paddleDetail.paddleXBottom;
});
socket.on("realScoreUpdate", (score) => {
  if (
    playerScore != score.computerScore ||
    computerScore != score.playerScore
  ) {
    ballX = 250;
    ballY = 350;
    playerScore = score.computerScore;
    computerScore = score.playerScore;
  }
});

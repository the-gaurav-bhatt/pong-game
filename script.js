const { body } = document;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.addEventListener("mousemove", movePaddle);

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
let computerPaddleSpeed = 0.1;
let currentPosition;

function updateScore() {
  if (ballY + ballRadius > height) {
    computerScore++;
    console.log("Computer Scored");
    resetBall();
  } else if (ballY - ballRadius < 0) {
    computerPaddleSpeed += 0.1;
    playerScore++;
    console.log("Player Scored");
    resetBall();
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
      console.log();
      return true;
    }
  }
  return false; // Return false if no collision occurred
}

function resetBall() {
  ballX = width / 2; // Center the ball on the X-axis
  ballY = height / 2; // Center the ball on the Y-axis
  speed = 5;
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
  updateScore();
  moveComputerPaddle();

  if (collisionPaddle(player)) {
    let direction = ballY < height / 2 ? 1 : -1; // Determine the direction based on ball position
    velocityY = direction * speed; // Update velocityY based on the speed and direction
    // Adjust velocityX based on where the ball hit the paddle
    velocityX = direction * speed * (currentPosition / (paddleWidth / 2));
    speed += 0.1; // Increase speed after each hit
    console.log("Collision with paddle. Direction:", direction);
  }

  collisionWall();
}

function movePaddle(e) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  // Adjust the paddle position so the mouse is at the center of the paddle
  paddleXBottom = mouseX - paddleWidth / 2;
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
  context.font = "32px Courier New";
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

function game() {
  body.appendChild(canvas);
  update(); //this will update all the movements, collision detection and score update
  renderCanvas(); // then those are updated here
}
const fps = 60;
setInterval(game, 1000 / 60); // this will give animation like feel

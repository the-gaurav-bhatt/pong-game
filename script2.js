const { body } = document;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.addEventListener("mousemove", movePaddle);
function movePaddle(e) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  // Adjust the paddle position so the mouse is at the center of the paddle
  paddleXBottom = mouseX - paddleWidth / 2;
}
// canvas height and width
const width = 500;
const height = 700;

// these will change later on
paddleXBottom = 370;
paddleXTop = 100;
// height and width of paddles
paddleHeight = 10;
paddleWidth = 50;

// regarding ball

ballX = 250;
ballY = 350;
ballRadius = 5;

// movement of the ball
speed = 5;
velocityX = 5;
velocityY = 5;

// scores
playerScore = 0;
computerScore = 0;

let currentPosition;

function resetBall() {
  ballX = 250;
  ballY = 350;
  speed = 5;
  velocityY = -velocityY;
}
function updateScore() {
  if (ballY + ballRadius > height) {
    computerScore++;
    resetBall();
  } else if (ballY - ballRadius < 0) {
    playerScore++;
    resetBall();
  }
}
function collisionPaddle(player) {
  if (player == "user") {
    if (
      ballY + ballRadius == height - 20 &&
      ballX - ballRadius >= paddleXBottom &&
      ballX + ballRadius <= paddleWidth + paddleXBottom
    ) {
      currentPosition = ballX + ballRadius - (paddleXBottom + paddleWidth / 2);
      console.log(
        "Bottom Center Position :" + (paddleXBottom + paddleWidth / 2)
      );
      console.log("Bottom Current Position :" + currentPosition);
      return true;
    }
  } else {
    // top
    if (
      ballY - ballRadius <= paddleHeight && // for y axis check
      ballX - ballRadius >= paddleXTop && // for x axis check (min), remove paddleHeight
      ballX + ballRadius <= paddleXTop + paddleWidth // for x (max), remove paddleHeight
    ) {
      currentPosition = ballX - ballRadius - (paddleXTop + paddleWidth / 2);
      console.log("Top Center Position :" + (paddleXTop + paddleWidth / 2));
      console.log("Top Current Position :" + currentPosition);
      return true;
    }
  }
}
function collisionWall() {
  if (ballX + ballRadius >= width || ballX - ballRadius <= 10) {
    // flip the direction
    velocityX = -velocityX;
  }
}
function update() {
  //updating the ball movement
  ballX += velocityX;
  ballY += velocityY;
  let player = ballX < canvas.height / 2 ? "comp" : "user";
  updateScore();

  if (collisionPaddle(player)) {
    console.log(velocityX, velocityY);
    // change the velocity based on where the ball hit the paddle
    if (player == "user") {
      currentPosition = currentPosition / paddleWidth + paddleXBottom / 2;
    } else {
      currentPosition = currentPosition / paddleWidth + paddleXTop / 2;
    }
    console.log(player);
    let angleRad = (Math.PI / 4) * currentPosition;
    let direction = ballY < canvas.height / 2 ? 1 : -1;
    velocityX = direction * speed * Math.cos(angleRad);
    velocityY = direction * speed * Math.sin(angleRad);
    console.log(velocityX, velocityY);
    speed += 0.1;
  }
  collisionWall();
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
  update(); //this will update all the movements, collision detection and score update
  renderCanvas(); // then those are updated here
}
const fps = 60;
setInterval(game, 1000 / 60); // this will give animation like feel

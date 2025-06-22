// Select canvas and set context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to full window size
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// Update canvas size on window resize
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Variables to track mouse position
let mouseX = null;
let mouseY = null;

// Update mouse position on movement
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Utility function to generate a random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ball class definition
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  // Draw the ball with radial gradient effect
  draw() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.2, this.x, this.y, this.size);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Update ball position and reverse velocity on hitting canvas edges
  update() {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Detect collision with other balls and change color
  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color =
            `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
        }
      }
    }
  }

  // Enlarge ball when hovered by mouse
  hoverEffect() {
    if (mouseX && mouseY) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + 20) {
        this.size = Math.min(this.size + 0.5, 30); // max size 30
      } else if (this.size > 10) {
        this.size -= 0.2; // shrink back if not near mouse
      }
    }
  }
}

// Array to hold all balls
let balls = [];

// Function to create a new ball with random properties
function createBall() {
  const size = random(10, 20);
  return new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-5, 5),
    random(-5, 5),
    `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,
    size
  );
}

// Create initial set of 25 balls
while (balls.length < 25) {
  balls.push(createBall());
}

// DOM elements for controlling ball count
const countDisplay = document.getElementById("ball-count");
const addBtn = document.getElementById("add-ball");
const removeBtn = document.getElementById("remove-ball");

// Function to update ball count in UI
function updateBallCount() {
  countDisplay.textContent = `Balls: ${balls.length}`;
}

// Event: Add one ball on button click
addBtn.addEventListener("click", () => {
  balls.push(createBall());
  updateBallCount();
});

// Event: Remove one ball on button click
removeBtn.addEventListener("click", () => {
  if (balls.length > 0) {
    balls.pop();
    updateBallCount();
  }
});

// Main animation loop
function loop() {
  // Faded black background for trailing effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Draw and update all balls
  balls.forEach((ball) => {
    ball.draw();
    ball.update();
    ball.collisionDetect();
    ball.hoverEffect();
  });

  requestAnimationFrame(loop); // recursive animation loop
}

// Start the animation
updateBallCount();
loop();

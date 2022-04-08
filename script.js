// Setup
window.focus;
let myCanvas = document.getElementById("myCanvas");
let c = myCanvas.getContext("2d");
myCanvas.width = 960;
myCanvas.height = 540;

console.log(myCanvas.width, myCanvas.height);

const gravity = 0.7;

class Players {
  constructor({ position, velocity, size, color }) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.color = color;
  }

  render() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }

  update() {
    this.render();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Floor collision
    if (this.position.y + this.size.y + this.velocity.y > myCanvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
    // Right wall collision
    if (this.position.x + this.size.x + this.velocity.x >= myCanvas.width) {
      if (this.position.x + this.size.x > myCanvas.width) {
        this.position.x -= this.velocity.x;
      }
    }
    // Left wall collision
    if (this.position.x < 0) {
      if (this.position.x + this.size.x < myCanvas.width) {
        this.position.x -= this.velocity.x;
      }
    }
  }
}

const player1 = new Players({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  size: {
    x: 50,
    y: 150,
  },
  color: "purple",
});

const player2 = new Players({
  position: {
    x: 910,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  size: {
    x: 50,
    y: 150,
  },
  color: "green",
});

let aPressed = false;
let dPressed = false;
let LeftArrowPressed = false;
let RightArrowPressed = false;

//Användarinput
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      aPressed = true;
      player1.velocity.x = -5;
      break;
    case "d":
      dPressed = true;
      player1.velocity.x = 5;
      break;
    case "w":
      if (
        player1.position.y + player1.size.y + player1.velocity.y >=
        myCanvas.height
      )
        player1.velocity.y = -20;
      break;
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      if (dPressed) {
        player1.velocity.x = 5;
      } else player1.velocity.x = 0;
      aPressed = false;
      break;
    case "d":
      if (aPressed) {
        player1.velocity.x = -5;
      } else player1.velocity.x = 0;
      dPressed = false;
      break;
  }
});
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      LeftArrowPressed = true;
      player2.velocity.x = -5;
      break;
    case "ArrowRight":
      RightArrowPressed = true;
      player2.velocity.x = 5;
      break;
    case "ArrowUp":
      if (
        player2.position.y + player2.size.y + player2.velocity.y >=
        myCanvas.height
      )
        player2.velocity.y = -20;
      break;
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (RightArrowPressed) {
        player2.velocity.x = 5;
      } else player2.velocity.x = 0;
      LeftArrowPressed = false;
      break;
    case "ArrowRight":
      if (LeftArrowPressed) {
        player2.velocity.x = -5;
      } else player2.velocity.x = 0;
      RightArrowPressed = false;
      break;
  }
});

// Animeringsfunktion
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); // Denna rad rensar skärmen
  player1.update();
  player2.update();
}

animate();

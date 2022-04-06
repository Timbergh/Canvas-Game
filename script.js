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

    if (this.position.y + this.size.y + this.velocity.y > myCanvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
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

//Användarinput
function movement(player, left, right, up) {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case left:
        player.velocity.x = -5;
        break;
      case right:
        player.velocity.x = 5;
        break;
      case up:
        player.velocity.y = -20;
        break;
    }
  });
}

// Animeringsfunktion
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); // Denna rad rensar skärmen
  player1.update();
  player2.update();
  movement(player1, "a", "d", "w");
  movement(player2, "ArrowLeft", "ArrowRight", "ArrowUp");
}

animate();

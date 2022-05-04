// Setup
window.focus;
let myCanvas = document.getElementById("myCanvas");
let c = myCanvas.getContext("2d");
myCanvas.width = 960;
myCanvas.height = 540;

console.log(myCanvas.width, myCanvas.height);

const gravity = 0.7;

class Players {
  constructor({ position, velocity, size, color, offset, dmg }) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.color = color;
    this.offset = offset;
    this.attack = {
      position: this.position,
      width: 110,
      height: 40,
    };
    this.attacking;
    this.knockbacked;
    this.combo = 0;
    this.dmg = dmg;
  }

  render() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    if (this.attacking) {
      c.fillRect(
        this.attack.position.x - this.offset,
        this.attack.position.y,
        this.attack.width,
        this.attack.height
      );
    }
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
    // Stop after knockback
    if (
      this.position.y + this.size.y + this.velocity.y > myCanvas.height &&
      this.knockbacked
    ) {
      this.velocity.x = 0;
      this.knockbacked = false;
    }
    // Right wall collision
    if (this.position.x + this.size.x / 2 >= myCanvas.width) {
      this.position.x -= this.velocity.x;
    }
    // Right collision + knockback fix
    if (this.position.x + this.size.x / 2 + 0.1 > myCanvas.width) {
      this.position.x = myCanvas.width - this.size.x;
    }
    // Left wall collision
    if (this.position.x + this.size.x / 2 <= 0) {
      this.position.x -= this.velocity.x;
    }
    // left collision + knockback fix
    if (this.position.x + this.size.x / 2 - 0.1 < 0) {
      this.position.x = 0;
    }
  }

  attackFunction() {
    this.attacking = true;
    setTimeout(() => {
      this.attacking = false;
    }, 100);
  }
}

const hpBar1 = new Players({
  position: {
    x: 20,
    y: 20,
  },
  size: {
    x: 400,
    y: 30,
  },
  color: "red",
});

const hpBar2 = new Players({
  position: {
    x: myCanvas.width - 420,
    y: 20,
  },
  size: {
    x: 400,
    y: 30,
  },
  color: "red",
});

const player1 = new Players({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  size: {
    x: 50,
    y: 150,
  },
  color: "purple",
  offset: 0,
  dmg: 10,
});

const player2 = new Players({
  position: {
    x: 910,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  size: {
    x: 50,
    y: 150,
  },
  color: "green",
  offset: 60,
  dmg: 10,
});

let aPressed = false;
let dPressed = false;
let LeftArrowPressed = false;
let RightArrowPressed = false;

player1.knockbacked = false;
player2.knockbacked = false;
function knockback(player, enemy) {
  if (player.offset == 0) {
    if (player.combo == 1) {
      enemy.velocity.x += 2;
      enemy.velocity.y += -3;
    } else if (player.combo == 2) {
      enemy.velocity.x += 5;
      enemy.velocity.y += -3;
    } else {
      enemy.velocity.x += 10;
      enemy.velocity.y += -4;
    }
    enemy.knockbacked = true;
  } else {
    if (player.combo == 1) {
      enemy.velocity.x += -2;
      enemy.velocity.y += -3;
    } else if (player.combo == 2) {
      enemy.velocity.x += -5;
      enemy.velocity.y += -3;
    } else {
      enemy.velocity.x += -10;
      enemy.velocity.y += -4;
    }
    enemy.knockbacked = true;
  }
}

function comboTimer(player) {
  let timeleft = 5;
  let startComboTimer = setInterval(function () {
    if (timeleft <= 1) {
      clearInterval(startComboTimer);
      player.combo = 0;
    }
    timeleft -= 1;
    console.log("Timer ", timeleft);
  }, 1000);
}

let collision = false;
function attackCollision(player, enemy, hpEnemy) {
  // Attack collision
  if (player.offset > 0) {
    if (
      player.attack.position.x - player.attack.width <= enemy.position.x &&
      player.attack.position.x >= enemy.position.x - enemy.size.x &&
      player.attack.position.y + player.attack.height >= enemy.position.y &&
      player.attack.position.y <= enemy.position.y + enemy.size.y &&
      player.attacking
    ) {
      collision = true;
      hpEnemy.size.x -= player.dmg;
      player.combo += 1;
      if (player.combo > 3) {
        player.combo = 1;
      }
      comboTimer(player);
      console.log(player.combo);
    }
  } else {
    if (
      player.attack.position.x + player.attack.width >= enemy.position.x &&
      player.attack.position.x <= enemy.position.x + enemy.size.x &&
      player.attack.position.y + player.attack.height >= enemy.position.y &&
      player.attack.position.y <= enemy.position.y + enemy.size.y &&
      player.attacking
    ) {
      collision = true;
      hpEnemy.size.x -= player.dmg;
      player.combo += 1;
      if (player.combo > 3) {
        player.combo = 1;
      }
      comboTimer(player);
      console.log(player.combo);
    }
  }
}

// Animeringsfunktion
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight); // Denna rad rensar skärmen
  player1.update();
  player2.update();
  hpBar1.render();
  hpBar2.render();
}

//Användarinput
let attackKeyPressed1 = false;
let attackKeyPressed2 = false;
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      if (!player1.knockbacked) {
        aPressed = true;
        player1.velocity.x = -5;
        player1.offset = 60;
        break;
      }
    case "d":
      if (!player1.knockbacked) {
        dPressed = true;
        player1.velocity.x = 5;
        player1.offset = 0;
        break;
      }
    case "w":
      if (
        player1.position.y + player1.size.y + player1.velocity.y >=
        myCanvas.height
      )
        player1.velocity.y = -15;
      break;
    case "s":
      if (!attackKeyPressed1) {
        attackKeyPressed1 = true;
        player1.attackFunction();
        attackCollision(player1, player2, hpBar2);
        if (collision) {
          knockback(player1, player2);
        }
        collision = false;
      }
      break;
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      if (!player1.knockbacked) {
        if (dPressed) {
          player1.velocity.x = 5;
        } else player1.velocity.x = 0;
      }
      aPressed = false;
      break;
    case "d":
      if (!player1.knockbacked) {
        if (aPressed) {
          player1.velocity.x = -5;
        } else player1.velocity.x = 0;
      }
      dPressed = false;
      break;
    case "s":
      attackKeyPressed1 = false;
      break;
  }
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (!player2.knockbacked) {
        LeftArrowPressed = true;
        player2.velocity.x = -5;
        player2.offset = 60;
        break;
      }
    case "ArrowRight":
      if (!player2.knockbacked) {
        RightArrowPressed = true;
        player2.velocity.x = 5;
        player2.offset = 0;
        break;
      }
    case "ArrowUp":
      if (
        player2.position.y + player2.size.y + player2.velocity.y >=
        myCanvas.height
      )
        player2.velocity.y = -15;
      break;
    case "ArrowDown":
      if (!attackKeyPressed2) {
        attackKeyPressed2 = true;
        player2.attackFunction();
        attackCollision(player2, player1, hpBar1);
        if (collision) {
          knockback(player2, player1);
        }
        collision = false;
        break;
      }
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      if (!player2.knockbacked) {
        if (RightArrowPressed) {
          player2.velocity.x = 5;
        } else player2.velocity.x = 0;
      }
      LeftArrowPressed = false;
      break;
    case "ArrowRight":
      if (!player2.knockbacked) {
        if (LeftArrowPressed) {
          player2.velocity.x = -5;
        } else player2.velocity.x = 0;
      }
      RightArrowPressed = false;
      break;
    case "ArrowDown":
      attackKeyPressed2 = false;
      break;
  }
});

animate();

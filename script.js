// Setup
window.focus;
let myCanvas = document.getElementById("myCanvas");
let c = myCanvas.getContext("2d");
let hp1 = document.getElementById("hp1");
let hp2 = document.getElementById("hp2");
myCanvas.width = 960;
myCanvas.height = 540;

const gravity = 0.7;
let end = false;

let hpLeft = document.getElementById("left");
let hpRight = document.getElementById("right");
let health = document.getElementById("health");
let play = document.getElementById("play");
let menu = document.getElementById("menu");

let maxHp = 100;
function menuFunction() {
  play.onclick = function () {
    menu.style.display = "none";
    hp1.style.width = `${maxHp}%`;
    hp2.style.width = `${maxHp}%`;
    startGame();
  };

  hpLeft.onclick = function () {
    if (maxHp < 20) {
      maxHp += 10;
    }
    maxHp -= 10;
    health.innerHTML = `${maxHp}`;
    return maxHp;
  };

  hpRight.onclick = function () {
    if (maxHp > 90) {
      maxHp -= 10;
    }
    maxHp += 10;
    health.innerHTML = `${maxHp}`;
    return maxHp;
  };
}
function startGame() {
  class Sprites {
    constructor({ position, imageSrc, size }) {
      this.position = position;
      this.image = new Image();
      this.image.src = imageSrc;
      this.size = size;
    }

    draw() {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
    }

    update() {
      this.draw();
    }
  }

  class Players {
    constructor({ position, velocity, size, color, offset }) {
      this.position = position;
      this.velocity = velocity;
      this.size = size;
      this.color = color;
      this.offset = offset;
      this.attack = {
        position: this.position,
        width: 110,
        height: 20,
      };
      this.attacking;
      this.knockbacked;
      this.combo = 0;
      this.hp = maxHp;
      this.dmg = NaN;
    }

    render() {
      c.fillStyle = this.color;
      //body
      c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
      //head
      c.fillRect(
        this.position.x + 30 - this.offset,
        this.position.y,
        this.size.x,
        -50
      );
      //attack
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
      if (
        this.position.y + this.size.y + this.velocity.y >
        myCanvas.height - 40
      ) {
        this.velocity.y = 0;
      } else {
        this.velocity.y += gravity;
      }
      // Stop after knockback
      if (
        this.position.y + this.size.y + this.velocity.y >
          myCanvas.height - 40 &&
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

  const background = new Sprites({
    position: {
      x: 0,
      y: -100,
    },
    imageSrc: "./background.png",
    size: {
      x: 960,
      y: 640,
    },
  });

  const player1 = new Players({
    position: {
      x: 300,
      y: 200,
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
  });

  const player2 = new Players({
    position: {
      x: 600,
      y: 200,
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
        player.dmg = 5;
      } else if (player.combo == 2) {
        enemy.velocity.x += 5;
        enemy.velocity.y += -3;
      } else {
        enemy.velocity.x += 10;
        enemy.velocity.y += -4;
        player.dmg = 10;
      }
      enemy.knockbacked = true;
    } else {
      if (player.combo == 1) {
        enemy.velocity.x += -2;
        enemy.velocity.y += -3;
        player.dmg = 5;
      } else if (player.combo == 2) {
        enemy.velocity.x += -5;
        enemy.velocity.y += -3;
      } else {
        enemy.velocity.x += -10;
        enemy.velocity.y += -4;
        player.dmg = 10;
      }
      enemy.knockbacked = true;
    }
  }

  let collision = false;
  function attackCollision(player, enemy) {
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
        player.combo += 1;
        if (player.combo > 3) {
          player.combo = 1;
        }
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
        player.combo += 1;
        if (player.combo > 3) {
          player.combo = 1;
        }
        console.log(player.combo);
      }
    }
  }

  // Animeringsfunktion
  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight); // Denna rad rensar skärmen
    background.update();
    player1.update();
    player2.update();

    if (player1.hp <= 0 && player2.hp <= 0) {
      c.font = "50px Permanent Marker";
      c.fillStyle = "red";
      c.textAlign = "center";
      c.fillText("TIE", myCanvas.width / 2, myCanvas.height / 2);
      end = true;
    } else if (player1.hp <= 0) {
      c.font = "50px Permanent Marker";
      c.fillStyle = "green";
      c.textAlign = "center";
      c.fillText("PLAYER 2 WINS", myCanvas.width / 2, myCanvas.height / 2);
      end = true;
    } else if (player2.hp <= 0) {
      c.font = "50px Permanent Marker";
      c.fillStyle = "purple";
      c.textAlign = "center";
      c.fillText("PLAYER 1 WINS", myCanvas.width / 2, myCanvas.height / 2);
      end = true;
    }
  }

  //Användarinput
  let attackKeyPressed1 = false;
  let attackKeyPressed2 = false;
  document.addEventListener("keydown", (e) => {
    //Player 1
    if (!end) {
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
            myCanvas.height - 40
          )
            player1.velocity.y = -15;
          break;
        case "s":
          if (!attackKeyPressed1) {
            attackKeyPressed1 = true;
            player1.attackFunction();
            attackCollision(player1, player2);
            if (collision) {
              knockback(player1, player2);
              player2.hp -= player1.dmg;
              hp2.style.width = player2.hp + "%";
            }
            collision = false;
          }
          break;
      }

      //Player 2
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
            myCanvas.height - 40
          )
            player2.velocity.y = -15;
          break;
        case "ArrowDown":
          if (!attackKeyPressed2) {
            attackKeyPressed2 = true;
            player2.attackFunction();
            attackCollision(player2, player1);
            if (collision) {
              knockback(player2, player1);
              player1.hp -= player2.dmg;
              hp1.style.width = player1.hp + "%";
            }
            collision = false;
            break;
          }
      }
    }
  });
  document.addEventListener("keyup", (e) => {
    //Player 1
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

    //Player 2
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
}
menuFunction();

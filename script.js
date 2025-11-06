// 🎮 Referencias a elementos del DOM
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const usernameInput = document.getElementById("username");
const game = document.getElementById("game");
const player = document.getElementById("player");
const playerNameDisplay = document.getElementById("player-name");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const creditsScreen = document.getElementById("credits-screen");
const finalName = document.getElementById("final-name");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

// 🧠 Variables de estado del juego
let playerX = 180;
let score = 0;
let speed = 5;
let username = "";

// 🎵 Música de fondo
const backgroundMusic = new Audio("background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

// 🟢 Iniciar el juego al hacer clic en "Aceptar"
startButton.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username === "") {
    alert("Por favor ingresa tu nombre.");
    return;
  }
  startScreen.style.display = "none";
  game.style.display = "block";
  playerNameDisplay.innerText = `Jugador: ${username}`;
  backgroundMusic.play(); // ▶️ Iniciar música
});

// 🔄 Reiniciar el juego al hacer clic en "Volver a jugar"
restartButton.addEventListener("click", () => {
  location.reload();
});

// ⌨️ Control del jugador con teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= 20;
  if (e.key === "ArrowRight" && playerX < 360) playerX += 20;
  if (e.key === " " || e.key === "ArrowUp") shoot();
  player.style.left = playerX + "px";
});

// 🖱️ Control del jugador con movimiento del mouse
game.addEventListener("mousemove", (e) => {
  const gameRect = game.getBoundingClientRect();
  const mouseX = e.clientX - gameRect.left;
  playerX = Math.max(0, Math.min(mouseX - 20, game.offsetWidth - 40));
  player.style.left = playerX + "px";
});

// 🔫 Función para disparar balas
function shoot() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = playerX + 18 + "px";
  bullet.style.bottom = "60px";
  game.appendChild(bullet);

  let bulletY = 60;
  const moveBullet = setInterval(() => {
    if (bulletY > 600) {
      clearInterval(moveBullet);
      bullet.remove();
    } else {
      bulletY += 10;
      bullet.style.bottom = bulletY + "px";

      // Verificar colisión con enemigos
      document.querySelectorAll(".enemy").forEach((enemy) => {
        if (checkCollision(bullet.getBoundingClientRect(), enemy.getBoundingClientRect())) {
          enemy.classList.add("explosion");
          setTimeout(() => enemy.remove(), 300);
          bullet.remove();
          clearInterval(moveBullet);
          score += 10;
          updateScore();
        }
      });
    }
  }, 20);
}

// 📈 Actualizar puntaje y nivel
function updateScore() {
  scoreDisplay.innerText = `Puntos: ${score}`;
  const level = Math.floor(score / 100) + 1;
  levelDisplay.innerText = `Nivel: ${level}`;
  speed = 5 + level - 1;

  // Guardar récord en localStorage
  const highScoreKey = `highscore_${username}`;
  const prevHigh = localStorage.getItem(highScoreKey) || 0;
  if (score > prevHigh) localStorage.setItem(highScoreKey, score);
}

// 👾 Crear enemigos que caen desde arriba
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 360) + "px";
  game.appendChild(enemy);

  let enemyY = 0;
  const fall = setInterval(() => {
    if (enemyY > 600) {
      clearInterval(fall);
      enemy.remove();
    } else {
      enemyY += speed;
      enemy.style.top = enemyY + "px";

      // Verificar colisión con el jugador
      if (checkCollision(player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
        clearInterval(fall);
        endGame();
      }
    }
  }, 20);
}

// 🧠 Función para verificar colisiones entre dos rectángulos
function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

// 🏁 Finalizar el juego y mostrar pantalla de créditos
function endGame() {
  backgroundMusic.pause(); // ⏹️ Detener música
  backgroundMusic.currentTime = 0;
  game.style.display = "none";
  finalName.innerText = username;
  finalScore.innerText = score;
  creditsScreen.style.display = "block";
}

// ⏱️ Crear enemigos cada segundo
setInterval(createEnemy, 1000);
// 🖱️ Control del jugador con movimiento del mouse
game.addEventListener("mousemove", (e) => {
  const gameRect = game.getBoundingClientRect();
  const mouseX = e.clientX - gameRect.left;
  playerX = Math.max(0, Math.min(mouseX - 20, game.offsetWidth - 40)); // Limitar dentro del área
  player.style.left = playerX + "px";
});

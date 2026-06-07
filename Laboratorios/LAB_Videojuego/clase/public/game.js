const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const H = canvas.height;
const W = canvas.width;

// Configuración base
const LANES = 4;
const LANE_WIDTH = W / LANES;
const CAR_WIDTH = 32;
const CAR_HEIGHT = 56;

const DASH_HEIGHT = 28;
const DASH_GAP = 24;

const DIFFICULTIES = {
  easy:   { label: 'FÁCIL',   roadSpeedBase: 200, spawnBase: 1.3, accelFactor: 0.5,  color: '#00ffaa' },
  normal: { label: 'NORMAL',  roadSpeedBase: 320, spawnBase: 0.9, accelFactor: 1.0,  color: '#ffdd00' },
  hard:   { label: 'DIFÍCIL', roadSpeedBase: 440, spawnBase: 0.6, accelFactor: 1.6,  color: '#ff66cc' }
};

// Estado de la pantalla de selección
let currentDifficulty = null; // null = en pantalla de selección
let selectedDiffKey = 'normal'; // botón resaltado antes de confirmar

// Parámetros activos (se sobreescriben al iniciar)
let BASE_ROAD_SPEED = 320;
let BASE_SPAWN_INTERVAL = 0.9;
let ACCEL_FACTOR = 1.0;
let roadSpeed = 320;

function laneToX(lane) {
  return lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
}

const player = {
  lane: 1,
  y: H - 80
};

let roadOffset = 0;
const enemies = [];
let spawnTimer = 0;
let gameOver = false;
let score = 0;
let scoreSubmitted = false;

// Botones de dificultad
const diffButtons = {
  easy:   { x: 20,  y: 220, w: 84, h: 36 },
  normal: { x: 118, y: 220, w: 84, h: 36 },
  hard:   { x: 216, y: 220, w: 84, h: 36 }
};

canvas.addEventListener('click', (e) => {
  // Solo activos en pantalla de selección
  if (currentDifficulty !== null) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top)  * scaleY;

  for (const [key, btn] of Object.entries(diffButtons)) {
    if (mx >= btn.x && mx <= btn.x + btn.w &&
        my >= btn.y && my <= btn.y + btn.h) {
      startGame(key);
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (currentDifficulty !== null) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top)  * scaleY;

  for (const [key, btn] of Object.entries(diffButtons)) {
    if (mx >= btn.x && mx <= btn.x + btn.w &&
        my >= btn.y && my <= btn.y + btn.h) {
      selectedDiffKey = key;
      return;
    }
  }
});

function startGame(diffKey) {
  const diff = DIFFICULTIES[diffKey];
  currentDifficulty = diffKey;
  BASE_ROAD_SPEED   = diff.roadSpeedBase;
  BASE_SPAWN_INTERVAL = diff.spawnBase;
  ACCEL_FACTOR      = diff.accelFactor;
  roadSpeed         = BASE_ROAD_SPEED;

  // Reiniciar estado
  enemies.length = 0;
  spawnTimer     = 0;
  gameOver       = false;
  score          = 0;
  scoreSubmitted = false;
  player.lane    = 1;
  roadOffset     = 0;
}

window.addEventListener("keydown", (e) => {
  // Teclado en pantalla de selección: 1=fácil 2=normal 3=difícil Enter=confirmar
  if (currentDifficulty === null) {
    if (e.key === '1') selectedDiffKey = 'easy';
    if (e.key === '2') selectedDiffKey = 'normal';
    if (e.key === '3') selectedDiffKey = 'hard';
    if (e.key === 'Enter' || e.key === ' ') startGame(selectedDiffKey);
    return;
  }

  if (e.key === "ArrowLeft" || e.key === "a") {
    player.lane = Math.max(0, player.lane - 1);
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    player.lane = Math.min(LANES - 1, player.lane + 1);
  }
  if (e.key === " " && gameOver) {
    // Volver a pantalla de selección tras game over
    currentDifficulty = null;
    selectedDiffKey   = 'normal';
  }
});

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

async function submitScore() {
  if (scoreSubmitted) return;
  scoreSubmitted = true;

  const name = (prompt('GAME OVER\nTu nombre (max 12):', 'ANON') || 'ANON').trim() || 'ANON';
  const diff  = DIFFICULTIES[currentDifficulty];

  try {
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        score: Math.floor(score),
        difficulty: diff.label
      })
    });
    const top = await res.json();
    console.log('Nuevo top 10:', top);
  } catch (err) {
    console.error('No se pudo enviar el score', err);
  }
}

function update(dt) {
  if (currentDifficulty === null || gameOver) return;

  score += dt * 100;

  // Velocidad escala según el factor de dificultad
  roadSpeed = BASE_ROAD_SPEED + Math.min(score / 4 * ACCEL_FACTOR, 400);

  roadOffset = (roadOffset + roadSpeed * dt) % (DASH_HEIGHT + DASH_GAP);

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnTimer = Math.max(0.25, BASE_SPAWN_INTERVAL - (score / 5000) * ACCEL_FACTOR);
    enemies.push({ lane: Math.floor(Math.random() * LANES), y: -CAR_HEIGHT });
  }

  for (const e of enemies) e.y += roadSpeed * dt;

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > H) enemies.splice(i, 1);
  }

  const px = laneToX(player.lane);
  for (const e of enemies) {
    const ex = laneToX(e.lane);
    if (rectsOverlap(px, player.y, CAR_WIDTH, CAR_HEIGHT, ex, e.y, CAR_WIDTH, CAR_HEIGHT)) {
      gameOver = true;
      submitScore();
      break;
    }
  }
}

function renderDifficultyScreen() {
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, W, H);

  // Título
  ctx.fillStyle = '#00ffaa';
  ctx.shadowColor = '#00ffaa';
  ctx.shadowBlur = 14;
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HIGHWAY DODGER', W / 2, 60);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#e0e0ff';
  ctx.font = '13px "Courier New", monospace';
  ctx.fillText('Elige tu nivel de dificultad', W / 2, 95);

  // Descripción de cada nivel
  const descs = {
    easy:   ['Velocidad base baja', 'Poco tráfico', 'Ideal para comenzar'],
    normal: ['Velocidad moderada', 'Tráfico normal', 'El clásico'],
    hard:   ['Velocidad alta', 'Tráfico denso', '¡Para expertos!']
  };

  // Botones
  for (const [key, btn] of Object.entries(diffButtons)) {
    const diff     = DIFFICULTIES[key];
    const hovered  = key === selectedDiffKey;

    ctx.fillStyle  = hovered ? diff.color : '#1a1a2e';
    ctx.strokeStyle = diff.color;
    ctx.lineWidth  = hovered ? 2 : 1;
    ctx.shadowColor = diff.color;
    ctx.shadowBlur  = hovered ? 12 : 0;

    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle  = hovered ? '#0a0a14' : diff.color;
    ctx.font       = `bold 13px "Courier New", monospace`;
    ctx.textAlign  = 'center';
    ctx.fillText(diff.label, btn.x + btn.w / 2, btn.y + 23);
  }

  // Descripción del nivel resaltado
  const selDiff = DIFFICULTIES[selectedDiffKey];
  const selDesc = descs[selectedDiffKey];
  ctx.fillStyle = '#888';
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'center';
  selDesc.forEach((line, i) => ctx.fillText(line, W / 2, 280 + i * 17));

  // Controles
  ctx.fillStyle = '#444';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('Clic o teclas 1 / 2 / 3 + Enter', W / 2, 370);

  // Decoración: mini carretera al fondo
  ctx.fillStyle = '#111122';
  ctx.fillRect(90, 390, 140, 70);
  ctx.strokeStyle = '#2a2a4a';
  ctx.lineWidth = 1;
  ctx.strokeRect(90, 390, 140, 70);
  ctx.fillStyle = '#00ffaa44';
  ctx.fillRect(148, 410, 10, 20);
  ctx.fillStyle = '#00ffaa';
  ctx.fillRect(150, 412, 8, 16);
}

function render() {
  // ── Pantalla de selección ──
  if (currentDifficulty === null) {
    renderDifficultyScreen();
    return;
  }

  // ── Juego activo ──
  ctx.fillStyle = "#111122";
  ctx.fillRect(0, 0, W, H);

  // Líneas divisoras
  ctx.fillStyle = "#3a3a5a";
  for (let lane = 1; lane < LANES; lane++) {
    const x = lane * LANE_WIDTH - 2;
    for (let y = -DASH_HEIGHT + roadOffset; y < H; y += DASH_HEIGHT + DASH_GAP) {
      ctx.fillRect(x, y, 4, DASH_HEIGHT);
    }
  }

  // Rivales
  ctx.fillStyle = "#ff66cc";
  for (const e of enemies) {
    ctx.fillRect(laneToX(e.lane), e.y, CAR_WIDTH, CAR_HEIGHT);
  }

  // Jugador
  ctx.shadowColor = "#00ffaa";
  ctx.shadowBlur  = 12;
  ctx.fillStyle   = "#00ffaa";
  ctx.fillRect(laneToX(player.lane), player.y, CAR_WIDTH, CAR_HEIGHT);
  ctx.shadowBlur  = 0;

  // HUD – Score
  ctx.fillStyle = '#00ffaa';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE: ' + Math.floor(score), 10, 24);

  // HUD – Velocidad
  ctx.fillStyle = "#888";
  ctx.font = '12px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('SPEED: ' + Math.floor(roadSpeed), W - 10, 24);

  // HUD – Nivel de dificultad (nueva etiqueta en la esquina inferior izquierda)
  const diff = DIFFICULTIES[currentDifficulty];
  ctx.fillStyle = diff.color;
  ctx.font = '11px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('NIVEL: ' + diff.label, 10, H - 8);

  // Game Over overlay
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ff66cc';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 20);

    ctx.fillStyle = '#e0e0ff';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('Puntuación: ' + Math.floor(score), W / 2, H / 2 + 10);
    ctx.fillText('Nivel: ' + diff.label, W / 2, H / 2 + 30);

    ctx.fillStyle = '#888';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('ESPACIO = seleccionar nivel', W / 2, H / 2 + 56);
  }
}

let lastTime = performance.now();

function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
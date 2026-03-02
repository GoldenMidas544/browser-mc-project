const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 32;
const ROWS = Math.floor(canvas.height / TILE);
const COLS = Math.floor(canvas.width / TILE);

// --- PLAYER ---
let player = {
    x: COLS / 2,
    y: ROWS / 2 - 10,   // spawn ABOVE the ground so player is visible
    vx: 0,
    vy: 0,
    width: 0.8,
    height: 1.8,
    onGround: false
};

const GRAVITY = 0.05;
const MOVE_SPEED = 0.1;
const JUMP_FORCE = -1.2;

// --- WORLD ---
let world = [];
let selectedBlock = 1; // 1 = dirt, 2 = stone

for (let y = 0; y < ROWS; y++) {
    world[y] = [];
    for (let x = 0; x < COLS; x++) {
        world[y][x] = y > ROWS / 2 ? 1 : 0; // ground layer
    }
}

// --- INPUT ---
let keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// --- MOUSE BLOCK PLACING ---
canvas.addEventListener("mousedown", (e) => {
    const x = Math.floor(e.clientX / TILE);
    const y = Math.floor(e.clientY / TILE);

    if (e.button === 0) {
        world[y][x] = 0; // break
    } else if (e.button === 2) {
        world[y][x] = selectedBlock; // place
    }
});

window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("keydown", (e) => {
    if (e.key === "1") selectedBlock = 1;
    if (e.key === "2") selectedBlock = 2;
});

// --- MAIN LOOP ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw world
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (world[y][x] === 1) ctx.fillStyle = "#8B4513"; // dirt
            else if (world[y][x] === 2) ctx.fillStyle = "#777"; // stone
            else continue;

            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
    }

    // --- PLAYER PHYSICS ---
    // Horizontal movement
    if (keys["a"] || keys["ArrowLeft"]) player.vx = -MOVE_SPEED;
    else if (keys["d"] || keys["ArrowRight"]) player.vx = MOVE_SPEED;
    else player.vx = 0;

    // Gravity
    player.vy += GRAVITY;

    // Jump
    if ((keys[" "] || keys["w"] || keys["ArrowUp"]) && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
    }

    // Apply movement
    player.x += player.vx;
    player.y += player.vy;

    // Simple ground collision
    player.onGround = false;
    if (player.y + player.height > ROWS) {
        player.y = ROWS - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // --- DRAW PLAYER ---
    ctx.fillStyle = "red";
    ctx.fillRect(
        player.x * TILE,
        player.y * TILE,
        player.width * TILE,
        player.height * TILE
    );

    requestAnimationFrame(draw);
}

draw();

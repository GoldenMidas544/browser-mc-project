let player = {
    x: COLS / 2,
    y: ROWS / 2,
    vx: 0,
    vy: 0,
    width: 0.8,
    height: 1.8,
    onGround: false
};

const GRAVITY = 0.05;
const MOVE_SPEED = 0.1;
const JUMP_FORCE = -1.2;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 32;
const ROWS = Math.floor(canvas.height / TILE);
const COLS = Math.floor(canvas.width / TILE);

let world = [];
let selectedBlock = 1; // 1 = dirt, 2 = stone

for (let y = 0; y < ROWS; y++) {
    world[y] = [];
    for (let x = 0; x < COLS; x++) {
        world[y][x] = y > ROWS / 2 ? 1 : 0; // ground layer
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (world[y][x] === 1) ctx.fillStyle = "#8B4513"; // dirt
            else if (world[y][x] === 2) ctx.fillStyle = "#777"; // stone
            else continue;

            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
    }

    requestAnimationFrame(draw);
}
draw();

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

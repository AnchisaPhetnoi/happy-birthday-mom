const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const soundCatch = document.getElementById('soundCatch');
const soundMiss = document.getElementById('soundMiss');
const soundSpecial = document.getElementById('soundSpecial');

const scoreEl = document.getElementById('score');
const lifeEl = document.getElementById('life');

// 🎁 ประเภทของขวัญ
const giftTypes = [
    { emoji: '🎁', score: 1, special: false },
    { emoji: '🧦', score: 1, special: false },
    { emoji: '🍪', score: 1, special: false },
    { emoji: '🎄', score: 2, special: false },
    { emoji: '🎅🏻', score: 5, special: true },
    { emoji: '⛄', score: 3, special: true }
];

// ตะกร้า
let basketX = 160;
const basketWidth = 80;
const basketHeight = 20;
const basketY = 450;

// เกม
let gifts = [];
let score = 0;
let life = 3;
let gameStarted = false;
let gameOver = false;
let baseSpeed = 3;

// ▶ เริ่มเกม
function startGame() {

    // 🔊 ปลดล็อกเสียง
    [soundCatch, soundMiss, soundSpecial].forEach(s => {
        s.currentTime = 0;
        s.play().then(() => s.pause());
    });

    gifts = [];
    score = 0;
    life = 3;
    gameStarted = true;
    gameOver = false;
    basketX = 160;

    scoreEl.textContent = score;
    lifeEl.textContent = life;

    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';

    update();
}

function restartGame() {
    startGame();
}

// 🖱 ควบคุมตะกร้า
canvas.addEventListener('mousemove', e => {
    if (!gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
});

// 🎁 สร้างของขวัญ
function createGift() {
    if (!gameStarted || gameOver) return;

    const gift = giftTypes[Math.floor(Math.random() * giftTypes.length)];
    gifts.push({
        x: Math.random() * 360,
        y: 0,
        emoji: gift.emoji,
        score: gift.score,
        special: gift.special
    });
}

// 💀 GAME OVER
function showGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 400, 500);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('GAME OVER', 95, 220);
    ctx.font = '18px Arial';
    ctx.fillText('คะแนน: ' + score, 145, 260);

    restartBtn.style.display = 'inline-block';
}

// 🎮 วาดเกม
function update() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, 400, 500);

    // ตะกร้า
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(basketX, basketY, basketWidth, basketHeight);

    gifts = gifts.filter(g => {
        g.y += baseSpeed;
        ctx.font = '28px Arial';
        ctx.fillText(g.emoji, g.x, g.y);

        // ✅ รับ
        if (g.y > basketY - 10 && g.x > basketX && g.x < basketX + basketWidth) {
            score += g.score;
            scoreEl.textContent = score;

            const sound = g.special ? soundSpecial : soundCatch;
            sound.currentTime = 0;
            sound.play();

            return false;
        }

        // ❌ พลาด
        if (g.y > 520) {
            life--;
            lifeEl.textContent = life;

            soundMiss.currentTime = 0;
            soundMiss.play();

            if (life <= 0) gameOver = true;
            return false;
        }

        return true;
    });

    if (gameOver) {
        showGameOver();
        return;
    }

    requestAnimationFrame(update);
}

// ✅ event listeners ต้องอยู่นอก update
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
setInterval(createGift, 900);
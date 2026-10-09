// ==================== MATRIX RAIN ====================
const matrixCanvas = document.getElementById('matrix-rain');
const matrixCtx = matrixCanvas.getContext('2d');
let matrixDrops = [];
const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  matrixDrops = [];
  const cols = Math.floor(matrixCanvas.width / 14);
  for (let i = 0; i < cols; i++) {
    matrixDrops.push({y: Math.random() * -100, speed: 2 + Math.random() * 3, chars: []});
  }
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

function animateMatrix() {
  if (!matrixCanvas.classList.contains('active')) {
    requestAnimationFrame(animateMatrix);
    return;
  }
  matrixCtx.fillStyle = 'rgba(5, 5, 5, 0.05)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixCtx.font = '12px "Space Mono"';
  const cols = Math.floor(matrixCanvas.width / 14);
  for (let i = 0; i < cols; i++) {
    const drop = matrixDrops[i];
    if (!drop) continue;
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    matrixCtx.fillStyle = `rgba(88, 166, 255, ${Math.random() * 0.5 + 0.3})`;
    matrixCtx.fillText(char, i * 14, drop.y);
    drop.y += drop.speed;
    if (drop.y > matrixCanvas.height && Math.random() > 0.975) {
      drop.y = -20;
    }
  }
  requestAnimationFrame(animateMatrix);
}
animateMatrix();

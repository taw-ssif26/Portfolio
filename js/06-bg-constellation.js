// ==================== CONSTELLATION CANVAS ====================
const constCanvas = document.getElementById('constellation-canvas');
const constCtx = constCanvas.getContext('2d');
let stars = [];

function resizeConst() {
  constCanvas.width = window.innerWidth;
  constCanvas.height = window.innerHeight;
}
resizeConst();
window.addEventListener('resize', resizeConst);

class Star {
  constructor() {
    this.x = Math.random() * constCanvas.width;
    this.y = Math.random() * constCanvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.03 + 0.01;
    this.color = Math.random() > 0.7 ? '210, 153, 34' : (Math.random() > 0.5 ? '88, 166, 255' : '200, 200, 220');
  }
  update() {
    this.twinklePhase += this.twinkleSpeed;
    this.x += Math.sin(this.twinklePhase * 0.1) * 0.1;
    this.y += Math.cos(this.twinklePhase * 0.1) * 0.1;
  }
  draw() {
    const alpha = 0.5 + 0.5 * Math.sin(this.twinklePhase);
    constCtx.beginPath();
    constCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    constCtx.fillStyle = `rgba(${this.color}, ${alpha})`;
    constCtx.fill();
    constCtx.beginPath();
    constCtx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    constCtx.fillStyle = `rgba(${this.color}, ${alpha * 0.15})`;
    constCtx.fill();
  }
}

for (let i = 0; i < 120; i++) stars.push(new Star());

function drawConstellations() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120 && Math.random() < 0.03) {
        constCtx.beginPath();
        constCtx.moveTo(stars[i].x, stars[i].y);
        constCtx.lineTo(stars[j].x, stars[j].y);
        constCtx.strokeStyle = `rgba(100, 140, 180, ${0.08 * (1 - dist/120)})`;
        constCtx.lineWidth = 0.5;
        constCtx.stroke();
      }
    }
  }
}

function animateConstellation() {
  constCtx.clearRect(0, 0, constCanvas.width, constCanvas.height);
  drawConstellations();
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateConstellation);
}
animateConstellation();

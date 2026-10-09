// ==================== FIBER OPTICS (NEW) ====================
const fiberCanvas = document.getElementById('fiber-optics');
const fiberCtx = fiberCanvas.getContext('2d');
let fibers = [];

function resizeFiber() {
  fiberCanvas.width = window.innerWidth;
  fiberCanvas.height = window.innerHeight;
}
resizeFiber();
window.addEventListener('resize', resizeFiber);

class Fiber {
  constructor() {
    this.x = Math.random() * fiberCanvas.width;
    this.y = Math.random() * fiberCanvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.length = 50 + Math.random() * 150;
    this.speed = 0.5 + Math.random() * 1.5;
    this.color = Math.random() > 0.5 ? '88,166,255' : '57,197,207';
    this.thickness = 0.5 + Math.random() * 1.5;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.03;
  }
  update() {
    this.pulsePhase += this.pulseSpeed;
    this.x += Math.cos(this.angle) * this.speed * 0.3;
    this.y += Math.sin(this.angle) * this.speed * 0.3;
    if (this.x < -this.length) this.x = fiberCanvas.width + this.length;
    if (this.x > fiberCanvas.width + this.length) this.x = -this.length;
    if (this.y < -this.length) this.y = fiberCanvas.height + this.length;
    if (this.y > fiberCanvas.height + this.length) this.y = -this.length;
  }
  draw() {
    const alpha = 0.3 + 0.4 * Math.sin(this.pulsePhase);
    const endX = this.x + Math.cos(this.angle) * this.length;
    const endY = this.y + Math.sin(this.angle) * this.length;

    // Glow
    fiberCtx.beginPath();
    fiberCtx.moveTo(this.x, this.y);
    fiberCtx.lineTo(endX, endY);
    fiberCtx.strokeStyle = `rgba(${this.color}, ${alpha * 0.3})`;
    fiberCtx.lineWidth = this.thickness * 4;
    fiberCtx.stroke();

    // Core
    fiberCtx.beginPath();
    fiberCtx.moveTo(this.x, this.y);
    fiberCtx.lineTo(endX, endY);
    fiberCtx.strokeStyle = `rgba(${this.color}, ${alpha})`;
    fiberCtx.lineWidth = this.thickness;
    fiberCtx.stroke();

    // Data packet traveling
    const packetT = (Math.sin(this.pulsePhase * 2) + 1) / 2;
    const px = this.x + (endX - this.x) * packetT;
    const py = this.y + (endY - this.y) * packetT;
    fiberCtx.beginPath();
    fiberCtx.arc(px, py, 2, 0, Math.PI * 2);
    fiberCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    fiberCtx.fill();
  }
}

for (let i = 0; i < 40; i++) fibers.push(new Fiber());

function animateFiberOptics() {
  if (!fiberCanvas.classList.contains('active')) {
    requestAnimationFrame(animateFiberOptics);
    return;
  }
  fiberCtx.fillStyle = 'rgba(5, 5, 5, 0.05)';
  fiberCtx.fillRect(0, 0, fiberCanvas.width, fiberCanvas.height);
  fibers.forEach(f => { f.update(); f.draw(); });
  requestAnimationFrame(animateFiberOptics);
}
animateFiberOptics();

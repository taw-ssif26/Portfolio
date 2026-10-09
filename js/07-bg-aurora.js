// ==================== AURORA CANVAS ====================
const auroraCanvas = document.getElementById('aurora-canvas');
const auroraCtx = auroraCanvas.getContext('2d');
let auroraWaves = [];

function resizeAurora() {
  auroraCanvas.width = window.innerWidth;
  auroraCanvas.height = window.innerHeight;
}
resizeAurora();
window.addEventListener('resize', resizeAurora);

class AuroraWave {
  constructor(index) {
    this.index = index;
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.003 + Math.random() * 0.002;
    this.amplitude = 30 + Math.random() * 50;
    this.frequency = 0.002 + Math.random() * 0.003;
    this.yOffset = auroraCanvas.height * (0.3 + index * 0.15);
    this.color = index % 2 === 0 ? '88, 166, 255' : '57, 197, 207';
  }
  update() { this.phase += this.speed; }
  draw() {
    auroraCtx.beginPath();
    for (let x = 0; x < auroraCanvas.width; x += 2) {
      const y = this.yOffset + Math.sin(x * this.frequency + this.phase) * this.amplitude
                  + Math.sin(x * this.frequency * 2 + this.phase * 1.5) * this.amplitude * 0.3;
      if (x === 0) auroraCtx.moveTo(x, y);
      else auroraCtx.lineTo(x, y);
    }
    auroraCtx.lineTo(auroraCanvas.width, auroraCanvas.height);
    auroraCtx.lineTo(0, auroraCanvas.height);
    auroraCtx.closePath();
    const gradient = auroraCtx.createLinearGradient(0, this.yOffset - 80, 0, auroraCanvas.height);
    gradient.addColorStop(0, `rgba(${this.color}, 0)`);
    gradient.addColorStop(0.2, `rgba(${this.color}, 0.06)`);
    gradient.addColorStop(0.5, `rgba(${this.color}, 0.1)`);
    gradient.addColorStop(0.8, `rgba(${this.color}, 0.04)`);
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);
    auroraCtx.fillStyle = gradient;
    auroraCtx.fill();
  }
}

for (let i = 0; i < 4; i++) auroraWaves.push(new AuroraWave(i));

function animateAurora() {
  auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
  auroraWaves.forEach(w => { w.update(); w.draw(); });
  requestAnimationFrame(animateAurora);
}
animateAurora();

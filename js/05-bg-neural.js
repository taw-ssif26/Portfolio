// ==================== NEURAL NETWORK CANVAS ====================
const neuralCanvas = document.getElementById('neural-canvas');
const neuralCtx = neuralCanvas.getContext('2d');
let neuralNodes = [];

function resizeNeural() {
  neuralCanvas.width = window.innerWidth;
  neuralCanvas.height = window.innerHeight;
}
resizeNeural();
window.addEventListener('resize', resizeNeural);

class NeuralNode {
  constructor() {
    this.x = Math.random() * neuralCanvas.width;
    this.y = Math.random() * neuralCanvas.height;
    this.size = Math.random() * 2 + 1;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.energy = Math.random();
  }
  update() {
    this.pulsePhase += this.pulseSpeed;
    this.energy = 0.5 + 0.5 * Math.sin(this.pulsePhase);
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 200 && dist > 0) {
      this.x += dx * 0.0003;
      this.y += dy * 0.0003;
    }
    if (this.x < 0) this.x = neuralCanvas.width;
    if (this.x > neuralCanvas.width) this.x = 0;
    if (this.y < 0) this.y = neuralCanvas.height;
    if (this.y > neuralCanvas.height) this.y = 0;
  }
  draw() {
    const alpha = 0.3 + this.energy * 0.4;
    neuralCtx.beginPath();
    neuralCtx.arc(this.x, this.y, this.size * (0.8 + this.energy * 0.4), 0, Math.PI * 2);
    neuralCtx.fillStyle = `rgba(88, 166, 255, ${alpha})`;
    neuralCtx.fill();
    neuralCtx.beginPath();
    neuralCtx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    neuralCtx.fillStyle = `rgba(88, 166, 255, ${alpha * 0.2})`;
    neuralCtx.fill();
  }
}

for (let i = 0; i < 60; i++) neuralNodes.push(new NeuralNode());

function drawNeuralConnections() {
  for (let i = 0; i < neuralNodes.length; i++) {
    for (let j = i + 1; j < neuralNodes.length; j++) {
      const dx = neuralNodes[i].x - neuralNodes[j].x;
      const dy = neuralNodes[i].y - neuralNodes[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200) {
        const energy = (neuralNodes[i].energy + neuralNodes[j].energy) / 2;
        const alpha = 0.08 * energy * (1 - dist/200);
        neuralCtx.beginPath();
        neuralCtx.moveTo(neuralNodes[i].x, neuralNodes[i].y);
        neuralCtx.lineTo(neuralNodes[j].x, neuralNodes[j].y);
        neuralCtx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
        neuralCtx.lineWidth = 0.8 + energy * 0.8;
        neuralCtx.stroke();
        if (Math.random() < 0.003) {
          const t = Math.random();
          const px = neuralNodes[i].x + (neuralNodes[j].x - neuralNodes[i].x) * t;
          const py = neuralNodes[i].y + (neuralNodes[j].y - neuralNodes[i].y) * t;
          neuralCtx.beginPath();
          neuralCtx.arc(px, py, 2, 0, Math.PI * 2);
          neuralCtx.fillStyle = `rgba(57, 197, 207, ${0.8})`;
          neuralCtx.fill();
        }
      }
    }
  }
}

function animateNeural() {
  neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
  drawNeuralConnections();
  neuralNodes.forEach(n => { n.update(); n.draw(); });
  requestAnimationFrame(animateNeural);
}
animateNeural();

// ==================== PARTICLE FIELD (NEW) ====================
const particleCanvas = document.getElementById('particle-field');
const particleCtx = particleCanvas.getContext('2d');
let fieldParticles = [];

function resizeParticleField() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeParticleField();
window.addEventListener('resize', resizeParticleField);

class FieldParticle {
  constructor() {
    this.x = Math.random() * particleCanvas.width;
    this.y = Math.random() * particleCanvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = Math.random() * 2 + 0.5;
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
    this.color = Math.random() > 0.6 ? '88,166,255' : (Math.random() > 0.5 ? '57,197,207' : '210,153,34');
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 100 && dist > 0) {
      this.vx += (dx / dist) * 0.05;
      this.vy += (dy / dist) * 0.05;
    }
    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;
    // Wrap
    if (this.x < 0) this.x = particleCanvas.width;
    if (this.x > particleCanvas.width) this.x = 0;
    if (this.y < 0) this.y = particleCanvas.height;
    if (this.y > particleCanvas.height) this.y = 0;
  }
  draw() {
    const alpha = (this.life / this.maxLife) * 0.6;
    particleCtx.beginPath();
    particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particleCtx.fillStyle = `rgba(${this.color}, ${alpha})`;
    particleCtx.fill();
  }
}

for (let i = 0; i < 150; i++) fieldParticles.push(new FieldParticle());

function animateParticleField() {
  if (!particleCanvas.classList.contains('active')) {
    requestAnimationFrame(animateParticleField);
    return;
  }
  particleCtx.fillStyle = 'rgba(5, 5, 5, 0.03)';
  particleCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);

  // Spawn new particles
  if (fieldParticles.length < 150 && Math.random() < 0.3) {
    fieldParticles.push(new FieldParticle());
  }

  fieldParticles = fieldParticles.filter(p => {
    p.update();
    p.draw();
    return p.life > 0;
  });

  // Draw trails between close particles
  for (let i = 0; i < fieldParticles.length; i++) {
    for (let j = i + 1; j < fieldParticles.length; j++) {
      const dx = fieldParticles[i].x - fieldParticles[j].x;
      const dy = fieldParticles[i].y - fieldParticles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) {
        particleCtx.beginPath();
        particleCtx.moveTo(fieldParticles[i].x, fieldParticles[i].y);
        particleCtx.lineTo(fieldParticles[j].x, fieldParticles[j].y);
        particleCtx.strokeStyle = `rgba(88, 166, 255, ${0.04 * (1 - dist/80)})`;
        particleCtx.lineWidth = 0.5;
        particleCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticleField);
}
animateParticleField();

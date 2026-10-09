// ==================== MOUSE TRACKING ====================
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.getElementById('cursor-core').style.transform = `translate(${e.clientX-4}px, ${e.clientY-4}px)`;
  document.getElementById('cursor-ring').style.transform = `translate(${e.clientX-20}px, ${e.clientY-20}px)`;
  document.getElementById('hud-coords').textContent = `X: ${String(e.clientX).padStart(4,'0')} | Y: ${String(e.clientY).padStart(4,'0')} | Z: ${Math.floor(Math.random()*1000).toString().padStart(4,'0')}`;
});

document.querySelectorAll('button, .nav-item, .desk-item, .vault-item, .contact-link, .contact-submit, .project-lab-card, .skill-node').forEach(el => {
  el.addEventListener('mouseenter', () => document.getElementById('cursor-ring').classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.getElementById('cursor-ring').classList.remove('hovering'));
});

// ==================== BOOT SEQUENCE ====================
function runBootSequence() {
  const bootCanvas = document.getElementById('boot-canvas');
  const bootCtx = bootCanvas.getContext('2d');
  bootCanvas.width = window.innerWidth;
  bootCanvas.height = window.innerHeight;

  const bootParticles = [];
  for (let i = 0; i < 50; i++) {
    bootParticles.push({
      x: Math.random() * bootCanvas.width,
      y: Math.random() * bootCanvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.7 ? '88,166,255' : (Math.random() > 0.5 ? '57,197,207' : '210,153,34')
    });
  }

  let bootProgress = 0;
  let bootFrame = 0;
  let bootAnimId;

  function animateBoot() {
    bootCtx.clearRect(0, 0, bootCanvas.width, bootCanvas.height);
    bootFrame++;

    bootParticles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = bootCanvas.width;
      if (p.x > bootCanvas.width) p.x = 0;
      if (p.y < 0) p.y = bootCanvas.height;
      if (p.y > bootCanvas.height) p.y = 0;
      bootCtx.beginPath();
      bootCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bootCtx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      bootCtx.fill();
    });

    for (let i = 0; i < bootParticles.length; i++) {
      for (let j = i + 1; j < bootParticles.length; j++) {
        const dx = bootParticles[i].x - bootParticles[j].x;
        const dy = bootParticles[i].y - bootParticles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          bootCtx.beginPath();
          bootCtx.moveTo(bootParticles[i].x, bootParticles[i].y);
          bootCtx.lineTo(bootParticles[j].x, bootParticles[j].y);
          bootCtx.strokeStyle = `rgba(88, 166, 255, ${0.03 * (1 - dist/100)})`;
          bootCtx.lineWidth = 0.5;
          bootCtx.stroke();
        }
      }
    }

    const cx = bootCanvas.width / 2;
    const cy = bootCanvas.height / 2;
    const time = bootFrame * 0.02;

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time;
      const r = 120 + Math.sin(time * 2 + i) * 10;
      const x1 = cx + Math.cos(angle) * r;
      const y1 = cy + Math.sin(angle) * r;
      const x2 = cx + Math.cos(angle + 0.3) * r;
      const y2 = cy + Math.sin(angle + 0.3) * r;
      bootCtx.beginPath();
      bootCtx.moveTo(x1, y1);
      bootCtx.lineTo(x2, y2);
      bootCtx.strokeStyle = `rgba(88, 166, 255, ${0.15 + Math.sin(time + i) * 0.1})`;
      bootCtx.lineWidth = 1;
      bootCtx.stroke();
    }

    bootCtx.beginPath();
    bootCtx.arc(cx, cy, 80, 0, Math.PI * 2);
    bootCtx.strokeStyle = `rgba(88, 166, 255, 0.08)`;
    bootCtx.lineWidth = 1;
    bootCtx.stroke();

    const progressAngle = (bootProgress / 100) * Math.PI * 2 - Math.PI / 2;
    bootCtx.beginPath();
    bootCtx.arc(cx, cy, 100, -Math.PI / 2, progressAngle);
    bootCtx.strokeStyle = `rgba(88, 166, 255, 0.4)`;
    bootCtx.lineWidth = 2;
    bootCtx.stroke();

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - time * 0.5;
      const r = 160 + Math.sin(time + i * 0.7) * 15;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const size = 3 + Math.sin(time * 2 + i) * 1;
      bootCtx.fillStyle = `rgba(57, 197, 207, ${0.3 + Math.sin(time + i) * 0.2})`;
      bootCtx.fillRect(x - size/2, y - size/2, size, size);
    }

    if (bootProgress < 100) {
      bootAnimId = requestAnimationFrame(animateBoot);
    }
  }

  animateBoot();

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 3 + 1;
    if (progress > 100) progress = 100;
    bootProgress = progress;
    document.getElementById('boot-progress-fill').style.width = progress + '%';
    document.getElementById('boot-percent').textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(progressInterval);
      document.getElementById('boot-status').textContent = 'SYSTEM READY';
      setTimeout(() => {
        cancelAnimationFrame(bootAnimId);
        document.getElementById('boot-sequence').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('boot-sequence').style.display = 'none';
          bootComplete = true;
          document.getElementById('live-dashboard').classList.add('visible');
          document.getElementById('bg-indicator').classList.add('visible');
          startBgRotation();
        }, 600);
      }, 800);
    }
  }, 80);
}

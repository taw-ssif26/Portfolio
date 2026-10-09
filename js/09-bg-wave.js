// ==================== WAVE INTERFERENCE ====================
const waveCanvas = document.getElementById('wave-interference');
const waveCtx = waveCanvas.getContext('2d');
let waveTime = 0;

function resizeWave() {
  waveCanvas.width = window.innerWidth;
  waveCanvas.height = window.innerHeight;
}
resizeWave();
window.addEventListener('resize', resizeWave);

function animateWave() {
  if (!waveCanvas.classList.contains('active')) {
    waveTime = 0;
    requestAnimationFrame(animateWave);
    return;
  }
  waveTime += 0.02;
  const imageData = waveCtx.createImageData(waveCanvas.width, waveCanvas.height);
  const data = imageData.data;
  const cx1 = waveCanvas.width * 0.3 + Math.sin(waveTime) * 50;
  const cy1 = waveCanvas.height * 0.4 + Math.cos(waveTime * 0.7) * 30;
  const cx2 = waveCanvas.width * 0.7 + Math.cos(waveTime * 0.8) * 40;
  const cy2 = waveCanvas.height * 0.6 + Math.sin(waveTime * 0.5) * 35;
  for (let y = 0; y < waveCanvas.height; y += 2) {
    for (let x = 0; x < waveCanvas.width; x += 2) {
      const d1 = Math.sqrt((x - cx1)**2 + (y - cy1)**2);
      const d2 = Math.sqrt((x - cx2)**2 + (y - cy2)**2);
      const interference = Math.sin(d1 * 0.05 - waveTime * 3) + Math.sin(d2 * 0.05 - waveTime * 2.5);
      const intensity = (interference + 2) / 4;
      const idx = (y * waveCanvas.width + x) * 4;
      data[idx] = 88 * intensity;
      data[idx + 1] = 166 * intensity;
      data[idx + 2] = 255 * intensity;
      data[idx + 3] = 8;
    }
  }
  waveCtx.putImageData(imageData, 0, 0);
  requestAnimationFrame(animateWave);
}
animateWave();

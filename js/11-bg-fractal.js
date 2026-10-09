// ==================== FRACTAL BACKGROUND ====================
const fractalCanvas = document.getElementById('fractal-bg');
const fractalCtx = fractalCanvas.getContext('2d');
let fractalZoom = 1;
let fractalCenterX = -0.5;
let fractalCenterY = 0;

function resizeFractal() {
  fractalCanvas.width = window.innerWidth;
  fractalCanvas.height = window.innerHeight;
}
resizeFractal();
window.addEventListener('resize', resizeFractal);

function drawFractal() {
  if (!fractalCanvas.classList.contains('active')) {
    fractalZoom = 1;
    requestAnimationFrame(drawFractal);
    return;
  }
  fractalZoom *= 1.002;
  if (fractalZoom > 100) fractalZoom = 1;
  const w = fractalCanvas.width;
  const h = fractalCanvas.height;
  const scale = 3.0 / fractalZoom;
  const imageData = fractalCtx.createImageData(w, h);
  const data = imageData.data;
  for (let py = 0; py < h; py += 2) {
    for (let px = 0; px < w; px += 2) {
      const x0 = fractalCenterX + (px - w/2) * scale / w;
      const y0 = fractalCenterY + (py - h/2) * scale / w;
      let x = 0, y = 0, iteration = 0;
      while (x*x + y*y <= 4 && iteration < 50) {
        const xtemp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = xtemp;
        iteration++;
      }
      const idx = (py * w + px) * 4;
      const color = iteration === 50 ? 0 : iteration * 3;
      data[idx] = color * 0.3;
      data[idx + 1] = color * 0.6;
      data[idx + 2] = color;
      data[idx + 3] = 6;
    }
  }
  fractalCtx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawFractal);
}
drawFractal();

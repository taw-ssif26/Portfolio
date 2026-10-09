// ==================== GRID TERRAIN (NEW) ====================
const gridCanvas = document.getElementById('grid-terrain');
const gridCtx = gridCanvas.getContext('2d');
let gridTime = 0;

function resizeGrid() {
  gridCanvas.width = window.innerWidth;
  gridCanvas.height = window.innerHeight;
}
resizeGrid();
window.addEventListener('resize', resizeGrid);

function animateGridTerrain() {
  if (!gridCanvas.classList.contains('active')) {
    gridTime = 0;
    requestAnimationFrame(animateGridTerrain);
    return;
  }
  gridTime += 0.01;
  gridCtx.fillStyle = 'rgba(5, 5, 5, 0.08)';
  gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

  const spacing = 40;
  const perspective = 300;
  const horizonY = gridCanvas.height * 0.4;

  for (let z = 1; z < 20; z++) {
    const depth = z / 20;
    const y = horizonY + (gridCanvas.height - horizonY) * depth;
    const alpha = (1 - depth) * 0.15;

    // Horizontal lines
    gridCtx.beginPath();
    gridCtx.moveTo(0, y);
    gridCtx.lineTo(gridCanvas.width, y);
    gridCtx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
    gridCtx.lineWidth = 0.5;
    gridCtx.stroke();

    // Wave effect on horizontal lines
    const waveY = y + Math.sin(gridTime + z * 0.3) * 5 * depth;
    gridCtx.beginPath();
    gridCtx.moveTo(0, waveY);
    for (let x = 0; x < gridCanvas.width; x += 10) {
      const wy = waveY + Math.sin(x * 0.02 + gridTime * 2 + z) * 3 * depth;
      gridCtx.lineTo(x, wy);
    }
    gridCtx.strokeStyle = `rgba(57, 197, 207, ${alpha * 0.5})`;
    gridCtx.lineWidth = 0.3;
    gridCtx.stroke();
  }

  // Vertical perspective lines
  for (let x = -gridCanvas.width; x < gridCanvas.width * 2; x += spacing * 2) {
    const centerX = gridCanvas.width / 2 + Math.sin(gridTime * 0.5) * 50;
    const dx = x - centerX;
    gridCtx.beginPath();
    gridCtx.moveTo(centerX + dx * 0.1, horizonY);
    gridCtx.lineTo(centerX + dx * 2, gridCanvas.height);
    gridCtx.strokeStyle = `rgba(88, 166, 255, ${0.03})`;
    gridCtx.lineWidth = 0.5;
    gridCtx.stroke();
  }

  requestAnimationFrame(animateGridTerrain);
}
animateGridTerrain();

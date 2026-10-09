// ==================== BACKGROUND ROTATION SYSTEM ====================
// Define all background effect modes
const bgModes = [
  {
    id: 'neural-constellation',
    name: 'NEURAL NETWORK',
    layers: ['neural-canvas', 'constellation-canvas', 'aurora-canvas'],
    baseOpacity: { 'neural-canvas': 1, 'constellation-canvas': 0.6, 'aurora-canvas': 0.3 }
  },
  {
    id: 'matrix-rain',
    name: 'MATRIX RAIN',
    layers: ['matrix-rain'],
    baseOpacity: { 'matrix-rain': 0.08 }
  },
  {
    id: 'wave-interference',
    name: 'WAVE INTERFERENCE',
    layers: ['wave-interference'],
    baseOpacity: { 'wave-interference': 0.15 }
  },
  {
    id: 'data-stream',
    name: 'DATA STREAM',
    layers: ['data-stream'],
    baseOpacity: { 'data-stream': 0.1 }
  },
  {
    id: 'fractal-zoom',
    name: 'FRACTAL ZOOM',
    layers: ['fractal-bg'],
    baseOpacity: { 'fractal-bg': 0.12 }
  },
  {
    id: 'particle-field',
    name: 'PARTICLE FIELD',
    layers: ['particle-field'],
    baseOpacity: { 'particle-field': 0.25 }
  },
  {
    id: 'grid-terrain',
    name: 'GRID TERRAIN',
    layers: ['grid-terrain'],
    baseOpacity: { 'grid-terrain': 0.2 }
  },
  {
    id: 'fiber-optics',
    name: 'FIBER OPTICS',
    layers: ['fiber-optics'],
    baseOpacity: { 'fiber-optics': 0.18 }
  }
];

let currentBgModeIndex = 0;
let bgRotationTimer = null;
const BG_ROTATION_INTERVAL = 20000; // 20 seconds per mode

function activateBgMode(modeIndex) {
  const mode = bgModes[modeIndex];

  // Fade out all canvases
  document.querySelectorAll('.bg-canvas').forEach(canvas => {
    canvas.classList.remove('active');
    canvas.style.opacity = '0';
  });

  // Fade in the new mode's layers
  mode.layers.forEach(layerId => {
    const canvas = document.getElementById(layerId);
    if (canvas) {
      canvas.classList.add('active');
      canvas.style.opacity = mode.baseOpacity[layerId] || 1;
    }
  });

  // Update indicator
  const indicator = document.getElementById('bg-indicator');
  const nameEl = document.getElementById('bg-name');
  if (indicator && nameEl) {
    nameEl.textContent = mode.name;
    indicator.classList.add('visible');
    // Flash the indicator
    indicator.style.opacity = '1';
    setTimeout(() => { indicator.style.opacity = '0.6'; }, 2000);
  }

  currentBgModeIndex = modeIndex;
}

function nextBgMode() {
  const nextIndex = (currentBgModeIndex + 1) % bgModes.length;
  activateBgMode(nextIndex);
}

function startBgRotation() {
  if (bgRotationTimer) clearInterval(bgRotationTimer);
  bgRotationTimer = setInterval(nextBgMode, BG_ROTATION_INTERVAL);
}

function stopBgRotation() {
  if (bgRotationTimer) {
    clearInterval(bgRotationTimer);
    bgRotationTimer = null;
  }
}

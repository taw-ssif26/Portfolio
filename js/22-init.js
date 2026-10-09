// ==================== INIT ====================
const startTime = new Date();
window.addEventListener('load', () => {
  runBootSequence();
  setInterval(updateDashboard, 2000);
  updateFPS();
});

// Prevent context menu
document.addEventListener('contextmenu', e => e.preventDefault());

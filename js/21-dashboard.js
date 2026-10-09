// ==================== LIVE DASHBOARD DRAG ====================
(function initDashboardDrag() {
  const panel = document.getElementById('live-dashboard');
  let isDown = false;
  let offsetX = 0, offsetY = 0;

  panel.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('dashboard-close')) return;
    isDown = true;
    panel.classList.add('dragging');
    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    panel.style.right = 'auto';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    panel.classList.remove('dragging');
  });
})();

// ==================== LIVE DASHBOARD ====================
function updateDashboard() {
  document.getElementById('dash-cpu').textContent = Math.floor(Math.random() * 30 + 5) + '%';
  document.getElementById('dash-cpu-bar').style.width = document.getElementById('dash-cpu').textContent;
  document.getElementById('dash-mem').textContent = (Math.random() * 4 + 2).toFixed(1) + ' GB';
  document.getElementById('dash-mem-bar').style.width = Math.floor(Math.random() * 40 + 20) + '%';
  document.getElementById('dash-net').textContent = (Math.random() * 5 + 0.5).toFixed(1) + ' MB/s';
  document.getElementById('dash-net-bar').style.width = Math.floor(Math.random() * 50 + 10) + '%';

  const now = new Date();
  const uptime = Math.floor((now - startTime) / 1000);
  const h = String(Math.floor(uptime/3600)).padStart(2,'0');
  const m = String(Math.floor((uptime%3600)/60)).padStart(2,'0');
  const s = String(uptime%60).padStart(2,'0');
  document.getElementById('dash-uptime').textContent = `${h}:${m}:${s}`;
  document.getElementById('hud-time').textContent = now.toLocaleTimeString('en-US',{hour12:false});
}

// ==================== FPS COUNTER ====================
let lastTime = performance.now();
let frameCount = 0;
function updateFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    document.getElementById('hud-fps').textContent = frameCount + ' FPS';
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(updateFPS);
}

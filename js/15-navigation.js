// ==================== ROOM NAVIGATION ====================
function goToRoom(roomId) {
  if (!bootComplete && roomId !== 'entrance') return;
  if (roomId === currentRoom) return;

  const overlay = document.getElementById('transition-overlay');
  overlay.classList.add('active');

  setTimeout(() => {
    document.querySelectorAll('.room').forEach(r => r.classList.remove('active'));
    document.getElementById('room-' + roomId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-room="${roomId}"]`).classList.add('active');
    currentRoom = roomId;
    if (roomId === 'factory') drawSkillConnectors();
    if (roomId === 'terminal') initTerminal();
    setTimeout(() => overlay.classList.remove('active'), 400);
  }, 600);
}

// ==================== SKILL CONNECTORS ====================
function drawSkillConnectors() {
  const network = document.getElementById('skills-network');
  network.querySelectorAll('.skill-connector').forEach(c => c.remove());
  const core = network.querySelector('.skill-node.core');
  const coreRect = core.getBoundingClientRect();
  const netRect = network.getBoundingClientRect();
  const coreX = coreRect.left - netRect.left + coreRect.width/2;
  const coreY = coreRect.top - netRect.top + coreRect.height/2;

  network.querySelectorAll('.skill-node:not(.core)').forEach(node => {
    const rect = node.getBoundingClientRect();
    const x = rect.left - netRect.left + rect.width/2;
    const y = rect.top - netRect.top + rect.height/2;
    const dx = x - coreX;
    const dy = y - coreY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const line = document.createElement('div');
    line.className = 'skill-connector';
    line.style.left = coreX + 'px';
    line.style.top = coreY + 'px';
    line.style.width = dist + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    network.appendChild(line);
    setTimeout(() => line.classList.add('active'), Math.random() * 1000);
  });
}

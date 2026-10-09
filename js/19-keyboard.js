// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (!bootComplete) {
    if (e.key !== 'F5' && e.key !== 'F12') {
      document.getElementById('boot-sequence').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('boot-sequence').style.display = 'none';
        bootComplete = true;
        document.getElementById('live-dashboard').classList.add('visible');
        document.getElementById('bg-indicator').classList.add('visible');
        startBgRotation();
      }, 600);
    }
    return;
  }

  checkKonami(e);

  const idx = rooms.indexOf(currentRoom);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    if (idx < rooms.length - 1) goToRoom(rooms[idx + 1]);
  } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    if (idx > 0) goToRoom(rooms[idx - 1]);
  } else if (e.key === 'Escape') {
    goToRoom('entrance');
  } else if (e.key === 'b' || e.key === 'B') {
    // Quick background switch with 'B' key
    nextBgMode();
    showEgg('Background: ' + bgModes[currentBgModeIndex].name);
  }
});

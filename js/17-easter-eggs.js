// ==================== EASTER EGGS ====================
function showEgg(text) {
  const notif = document.getElementById('egg-notification');
  document.getElementById('egg-text').textContent = text;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 4000);
}

function checkKonami(e) {
  konamiCode.push(e.key);
  if (konamiCode.length > 10) konamiCode.shift();
  const indicator = document.getElementById('konami-indicator');
  indicator.classList.add('active');
  setTimeout(() => indicator.classList.remove('active'), 2000);
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    showEgg('Konami Code accepted. Secret room unlocked!');
    goToRoom('secret');
    konamiCode = [];
  }
}

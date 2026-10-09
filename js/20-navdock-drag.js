// ==================== NAV DOCK DRAG-TO-SCROLL ====================
(function initNavDockDrag() {
  const dock = document.getElementById('nav-dock');
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let moved = false;

  dock.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = false;
    dock.classList.add('dragging');
    startX = e.pageX;
    scrollLeftStart = dock.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    dock.scrollLeft = scrollLeftStart - dx;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    dock.classList.remove('dragging');
  });

  dock.addEventListener('touchstart', (e) => {
    isDown = true;
    moved = false;
    startX = e.touches[0].pageX;
    scrollLeftStart = dock.scrollLeft;
  }, {passive:true});
  dock.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const dx = e.touches[0].pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    dock.scrollLeft = scrollLeftStart - dx;
  }, {passive:true});
  dock.addEventListener('touchend', () => { isDown = false; });

  dock.addEventListener('click', (e) => {
    if (moved) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
})();

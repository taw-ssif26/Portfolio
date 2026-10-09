// ==================== DATA STREAM ====================
const streamCanvas = document.getElementById('data-stream');
const streamCtx = streamCanvas.getContext('2d');
let streamPackets = [];

function resizeStream() {
  streamCanvas.width = window.innerWidth;
  streamCanvas.height = window.innerHeight;
}
resizeStream();
window.addEventListener('resize', resizeStream);

function animateStream() {
  if (!streamCanvas.classList.contains('active')) {
    streamPackets = [];
    requestAnimationFrame(animateStream);
    return;
  }
  streamCtx.clearRect(0, 0, streamCanvas.width, streamCanvas.height);
  if (Math.random() < 0.1) {
    streamPackets.push({
      x: Math.random() * streamCanvas.width,
      y: -20,
      speed: 3 + Math.random() * 5,
      length: 20 + Math.random() * 60,
      color: Math.random() > 0.5 ? '88, 166, 255' : '57, 197, 207'
    });
  }
  streamPackets = streamPackets.filter(p => {
    p.y += p.speed;
    streamCtx.beginPath();
    streamCtx.moveTo(p.x, p.y);
    streamCtx.lineTo(p.x, p.y - p.length);
    streamCtx.strokeStyle = `rgba(${p.color}, ${0.3})`;
    streamCtx.lineWidth = 1;
    streamCtx.stroke();
    return p.y < streamCanvas.height + 50;
  });
  requestAnimationFrame(animateStream);
}
animateStream();

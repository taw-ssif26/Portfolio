// ==================== STATE ====================
let currentRoom = 'entrance';
let bootComplete = false;
let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const rooms = ['entrance','core','projects','factory','research','terminal','vault','contact'];
let terminalHistory = [];
let terminalHistoryIndex = -1;

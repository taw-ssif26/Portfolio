// ==================== TERMINAL ====================
function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (body.querySelector('.terminal-input-line')) {
    body.querySelector('.terminal-input').focus();
    return;
  }
  const inputLine = document.createElement('div');
  inputLine.className = 'terminal-line terminal-input-line';
  inputLine.innerHTML = '<span class="prompt">tawsif@foundry:~$ </span><input type="text" class="terminal-input" spellcheck="false" autocomplete="off"><span class="terminal-cursor"></span>';
  body.appendChild(inputLine);
  const input = inputLine.querySelector('.terminal-input');
  input.focus();
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        terminalHistory.push(cmd);
        terminalHistoryIndex = terminalHistory.length;
        addTerminalLine('tawsif@foundry:~$ ' + cmd, 'prompt');
        processCommand(cmd);
      }
      input.value = '';
      body.scrollTop = body.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (terminalHistory.length && terminalHistoryIndex > 0) {
        terminalHistoryIndex--;
        input.value = terminalHistory[terminalHistoryIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (terminalHistoryIndex < terminalHistory.length - 1) {
        terminalHistoryIndex++;
        input.value = terminalHistory[terminalHistoryIndex];
      } else {
        terminalHistoryIndex = terminalHistory.length;
        input.value = '';
      }
    }
  });
  document.getElementById('room-terminal').addEventListener('click', () => input.focus());
}

function addTerminalLine(text, cls) {
  const body = document.getElementById('terminal-body');
  const line = document.createElement('div');
  line.className = 'terminal-line ' + cls;
  line.textContent = text;
  body.insertBefore(line, body.lastElementChild);
}

function processCommand(cmd) {
  const commands = {
    help: () => {
      addTerminalLine('Available commands:', 'info');
      addTerminalLine('  help      - Show this help message', 'output');
      addTerminalLine('  about     - Display developer information', 'output');
      addTerminalLine('  skills    - List technical capabilities', 'output');
      addTerminalLine('  projects  - Show active project list', 'output');
      addTerminalLine('  contact   - Display contact information', 'output');
      addTerminalLine('  whoami    - Current user identity', 'output');
      addTerminalLine('  ls        - List directory contents', 'output');
      addTerminalLine('  cat       - Display file contents', 'output');
      addTerminalLine('  pwd       - Print working directory', 'output');
      addTerminalLine('  history   - Show command history', 'output');
      addTerminalLine('  clear     - Clear terminal screen', 'output');
      addTerminalLine('  secret    - ???', 'output');
      addTerminalLine('  easteregg - ???', 'output');
      addTerminalLine('  debug     - Toggle debug mode', 'output');
      addTerminalLine('  bg        - Cycle background effect', 'output');
    },
    about: () => {
      addTerminalLine('Name: Md Abu Tawsif', 'output');
      addTerminalLine('Role: Automation Engineer & AI Systems Architect', 'output');
      addTerminalLine('Location: Bangladesh (Global Remote)', 'output');
      addTerminalLine('Focus: Building intelligent automation systems that eliminate repetitive work', 'output');
      addTerminalLine('Philosophy: Technology should serve people, not the other way around', 'output');
    },
    skills: () => {
      addTerminalLine('Core Technologies:', 'info');
      addTerminalLine('  Python, FastAPI, Flask, JavaScript, React, Next.js', 'output');
      addTerminalLine('  OpenAI, Claude, Gemini, n8n, Docker, Linux', 'output');
      addTerminalLine('  PostgreSQL, MongoDB, SQLite, AWS, Git', 'output');
      addTerminalLine('  Scrapy, Selenium, BeautifulSoup, REST APIs', 'output');
    },
    projects: () => {
      addTerminalLine('Active Projects:', 'info');
      addTerminalLine('  [WS-001] Gmail AI Automation - Email intelligence system', 'output');
      addTerminalLine('  [WS-002] Clinic Telegram Bot - Healthcare appointments', 'output');
      addTerminalLine('  [WS-003] Scraper AI - Universal web scraper', 'output');
      addTerminalLine('  [WS-004] Knowledge Platform - Enterprise AI knowledge base', 'output');
      addTerminalLine('  [WS-005] Coaching Center Website - Premium education platform', 'output');
    },
    contact: () => {
      addTerminalLine('Email: tawsif@example.com', 'output');
      addTerminalLine('LinkedIn: /in/mdabutawsif', 'output');
      addTerminalLine('GitHub: @mdabutawsif', 'output');
      addTerminalLine('Telegram: @mdabutawsif', 'output');
      addTerminalLine('Response time: Within 24 hours', 'info');
    },
    whoami: () => addTerminalLine('tawsif - Automation Engineer at AI Foundry', 'output'),
    ls: () => {
      addTerminalLine('automations/  projects/  scripts/  configs/  logs/  secrets/', 'output');
      addTerminalLine('total 6 directories, 0 files visible', 'info');
    },
    cat: () => addTerminalLine('Usage: cat <filename> (try: cat README.md)', 'warn'),
    pwd: () => addTerminalLine('/home/tawsif/foundry', 'output'),
    history: () => {
      if (!terminalHistory.length) { addTerminalLine('No commands in history yet.', 'output'); return; }
      terminalHistory.forEach((h, i) => addTerminalLine(`  ${i+1}  ${h}`, 'output'));
    },
    clear: () => {
      const body = document.getElementById('terminal-body');
      body.querySelectorAll('.terminal-line:not(.terminal-input-line)').forEach(l => l.remove());
    },
    secret: () => {
      addTerminalLine('Accessing classified files...', 'warn');
      setTimeout(() => {
        addTerminalLine('ERROR: Insufficient clearance level', 'error');
        addTerminalLine('Hint: Try the Konami code elsewhere...', 'info');
      }, 800);
    },
    easteregg: () => {
      addTerminalLine('You found an Easter egg!', 'info');
      addTerminalLine('The developer once automated his own coffee machine using a Raspberry Pi.', 'output');
      addTerminalLine('It now brews coffee at 8:00 AM every weekday.', 'output');
      showEgg('Easter Egg: Coffee Machine Automation');
    },
    debug: () => {
      addTerminalLine('Debug mode: ON', 'warn');
      addTerminalLine('Current room: ' + currentRoom, 'output');
      addTerminalLine('Background mode: ' + bgModes[currentBgModeIndex].name, 'output');
      addTerminalLine('Konami progress: ' + konamiCode.length + '/10', 'output');
      addTerminalLine('Boot complete: ' + bootComplete, 'output');
    },
    bg: () => {
      nextBgMode();
      addTerminalLine('Background switched to: ' + bgModes[currentBgModeIndex].name, 'info');
    }
  };

  if (commands[cmd]) {
    commands[cmd]();
  } else {
    addTerminalLine('Command not found: ' + cmd, 'error');
    addTerminalLine('Type "help" for available commands', 'info');
  }
  addTerminalLine('', 'output');
}

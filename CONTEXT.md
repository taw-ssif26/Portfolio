## Project: AI Foundry Portfolio (Md Abu Tawsif)
## Stack: Static site — HTML + CSS + vanilla JS (no build step, no dependencies). Google Fonts via CDN.
## Current State: Fully working. Split from a single index.html into css/ + js/ with ZERO behavior changes. Output identical to original.
## Active Problem: None. Next work is editing/upgrading per segment.
## Key Files:
- index.html — markup only (rooms, HUD, nav dock) + ordered <link>/<script> tags
- css/01-base.css — variables (:root), reset, body, custom cursor
- css/02-boot.css — boot/loading screen
- css/03-backgrounds.css — .bg-canvas layers + room transition overlay
- css/04-hud.css — HUD, live dashboard, achievement toast, konami hint, nav dock
- css/05-rooms.css — room container/shell, Gate (entrance), Core
- css/06-projects.css — Lab (project cards)
- css/07-skills-network.css — Network (skill nodes/connectors)
- css/08-workspace.css — Workspace room
- css/09-terminal.css — Terminal room
- css/10-contact.css — Command (contact) room
- css/11-vault-secret.css — Vault, secret room, scrollbars, bg indicator
- css/12-responsive.css — all @media rules (keep LAST)
- js/01-state.js — shared global state
- js/02-bg-rotation.js — background mode list + 20s rotation
- js/03-boot.js — boot sequence animation
- js/04-mouse.js — cursor tracking, HUD coords, hover ring
- js/05..14-bg-*.js — one file per background effect (neural, constellation, aurora, matrix, wave, datastream, fractal, particles, grid, fiber)
- js/15-navigation.js — goToRoom, skill connectors
- js/16-projects.js — lab card toggle/activate
- js/17-easter-eggs.js — showEgg toast, Konami code
- js/18-terminal.js — terminal UI + commands
- js/19-keyboard.js — keyboard navigation
- js/20-navdock-drag.js — drag-to-scroll nav dock
- js/21-dashboard.js — dashboard drag, live metrics, FPS
- js/22-init.js — startup on window load, context menu block
- assets/ — images referenced by index.html (tlogo.jpeg, macbook.jpeg, desktop.jpeg, kb.png, notebook.png, coffee.jpg, plant.jpeg, pic.jpg, 1000056406.jpg). NOT included: copy your existing assets folder here.
## Decisions Made:
- Classic <script> tags (not ES modules): all files share one global scope exactly like the original single script, so inline onclick handlers (goToRoom, showEgg, toggleLab, activateProject) keep working and it still opens via file:// with no server.
- Numeric filename prefixes: load order is the dependency order (state, bg-rotation, boot, mouse, effects, navigation, ..., init). Do not reorder or rename without updating index.html.
- CSS split in original cascade order; 12-responsive.css stays last so media queries still override.
- Two <base target="_blank"> tags kept as in the original (harmless duplicate).
## Next Step: Copy your assets/ folder next to index.html, open index.html in a browser and compare with the old version.

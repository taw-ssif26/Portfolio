// Two-layer colour wipe used for route changes and environment switches.
// `at` runs while the screen is fully covered.
export function playShift(at: () => void) {
  const a = document.getElementById("shift"), b = document.getElementById("shift2");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !a || !b) { at(); return; }
  for (const el of [a, b]) { el.classList.remove("go"); void el.offsetWidth; el.classList.add("go"); }
  setTimeout(at, 400);
  setTimeout(() => { a.classList.remove("go"); b.classList.remove("go"); }, 1100);
}

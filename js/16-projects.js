// ==================== PROJECT ACTIVATION ====================
function toggleLab(el, project) {
  document.querySelectorAll('.project-lab-card.expanded').forEach(card => {
    if (card !== el) card.classList.remove('expanded');
  });
  el.classList.toggle('expanded');
}

function activateProject(el, project) {
  const card = el.closest('.project-lab-card');
  if (card) {
    card.style.borderColor = 'var(--accent-amber)';
    card.style.boxShadow = '0 0 40px rgba(210, 153, 34, 0.2)';
  }
  const messages = {
    gmail: 'Gmail AI Automation ACTIVATED. Processing 2,341 emails... Labels generated. Drafts ready.',
    clinic: 'Clinic Bot ACTIVATED. 847 active sessions. Next appointment in 12 minutes.',
    scraper: 'Scraper AI ACTIVATED. 12 concurrent jobs running. 3,421 records extracted today.',
    knowledge: 'Knowledge Platform ACTIVATED. 3 companies indexed. 14,203 queries served.',
    coaching: 'Coaching Website ACTIVATED. 1,234 students enrolled. Payment gateway online.'
  };
  showEgg(messages[project] || 'System activated.');
  setTimeout(() => {
    if (card) { card.style.borderColor = ''; card.style.boxShadow = ''; }
  }, 2000);
}

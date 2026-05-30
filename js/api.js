/* api.js — બધા API કોલ્સ એક જગ્યાએ */
const API = {
  // Classes
  getClasses: () => fetch('/api/classes').then(r => r.json()),
  addClass: (name) => fetch('/api/classes', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name})
  }).then(r => r.json()),
  deleteClass: (name) => fetch(`/api/classes/${name}`, {method:'DELETE'}).then(r => r.json()),

  // Teachers
  getTeachers: () => fetch('/api/teachers').then(r => r.json()),
  addTeacher: (name) => fetch('/api/teachers', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name})
  }).then(r => r.json()),
  updateTeacher: (name, subjects) => fetch(`/api/teachers/${name}`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({subjects})
  }).then(r => r.json()),
  deleteTeacher: (name) => fetch(`/api/teachers/${name}`, {method:'DELETE'}).then(r => r.json()),

  // Subjects (Master List)
  getAllSubjects: () => fetch('/api/subjects').then(r => r.json()),
  addSubject: (name) => fetch('/api/subjects', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name})
  }).then(r => r.json()),
  deleteSubject: (name) => fetch(`/api/subjects/${name}`, {method:'DELETE'}).then(r => r.json()),

  // Subjects (per class)
  getSubjects: (cls) => fetch(`/api/classes/${cls}/subjects`).then(r => r.json()),
  updateSubjects: (cls, subjects) => fetch(`/api/classes/${cls}/subjects`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({subjects})
  }).then(r => r.json()),

  // Timetable
  getTimetable: (cls) => fetch(`/api/timetable/${cls}`).then(r => r.json()),
  updateCell: (cls, data) => fetch(`/api/timetable/${cls}/cell`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  }).then(r => r.json()),
  generate: () => fetch('/api/generate', {method:'POST'}).then(r => r.json()),

  // Settings
  getSettings: () => fetch('/api/settings').then(r => r.json()),
  saveSettings: (data) => fetch('/api/settings', {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Export
  exportCSV: (cls) => window.open(`/api/export/${cls}`, '_blank'),

  // Day Config
  getDayConfig: () => fetch('/api/day-config').then(r => r.json()),
  saveDayConfig: (configs) => fetch('/api/day-config', {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({configs})
  }).then(r => r.json()),
};

/* Toast */
function showToast(msg, type='info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `show ${type}`;
  setTimeout(() => { el.className = ''; }, 3000);
}

/* Modal helpers */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* Close modal on overlay click */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

/* Subject colors */
const SUBJ_COLORS = {
  'Gujarati':'#0891b2','English':'#7c3aed','Maths':'#dc2626',
  'Science':'#059669','Sanskrit':'#d97706','Hindi':'#9333ea',
  'Economics':'#2563eb','Statistics':'#0d9488','Accountancy':'#ca8a04',
  'Sociology':'#db2777','Psychology':'#c026d3','S.P.':'#4f46e5',
  'P.E.':'#16a34a','Yoga':'#65a30d','Computer':'#6366f1'
};
function subjColor(s) { return SUBJ_COLORS[s] || '#6b7280'; }

/* Days */
const DAYS = ['સોમવાર','મંગળવાર','બુધવાર','ગુરુવાર','શુક્રવાર','શનિવાર'];
const DAYS_SHORT = ['સો','મં','બુ','ગુ','શુ','શ'];

const fs = require("fs");
const path = require("path");

const rootDir = __dirname;

// ⭐ Define new sessions here
const newSessions = ["session6"]; // leave empty [] if none

// Session titles
const sessionTitles = {
  session1: "Introduction & Basics",
  session2: "Daily Routines",
  session4: "Food & Preferences"
};

// File titles
const fileTitles = {
  "handout.html": "Handout",
  "homework.html": "Homework"
};

// Icons
function getIcon(file) {
  if (file.includes("homework")) return "📄";
  if (file.includes("handout")) return "📘";
  if (file.includes("phonics")) return "🔤";
  if (file.includes("activity")) return "🎯";
  if (file.includes("listening")) return "🎧";
  return "📁";
}

// Helpers
function formatName(name) {
  return name
    .replace(".html", "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

function getSessionNumber(session) {
  return parseInt(session.replace("session", ""));
}

function getSessionTitle(session) {
  const num = getSessionNumber(session);
  const title = sessionTitles[session] || "Lesson";
  return `Lesson ${num} - ${title}`;
}

function getSessions() {
  return fs.readdirSync(rootDir)
    .filter(f => f.startsWith("session") && fs.statSync(f).isDirectory())
    .sort((a, b) => getSessionNumber(a) - getSessionNumber(b));
}

// Generate student content
function generateStudentContent(student) {
  const sessions = getSessions();
  let html = "";

  sessions.forEach(session => {
    const studentPath = path.join(rootDir, session, student);
    if (!fs.existsSync(studentPath)) return;

    const files = fs.readdirSync(studentPath).filter(f => f.endsWith(".html"));
    if (files.length === 0) return;

    const title = getSessionTitle(session);
    const isNew = newSessions.includes(session);

    html += `
<div class="card ${isNew ? "new" : ""}" data-session="${session}">
  <div class="card-header" onclick="toggleCard(this)">
    <h3>${title} ${isNew ? "⭐" : ""}</h3>
    <span class="toggle-icon">${isNew ? "▲" : "▼"}</span>
  </div>
  <div class="card-body" style="display:${isNew ? "block" : "none"};">
    <div class="pill-group">`;

    files.forEach(file => {
      const label = fileTitles[file] || formatName(file);
      const icon = getIcon(file);

      html += `
<a class="pill" href="${session}/${student}/${file}">
   ${icon} ${label}
</a>`;
    });

    html += `
    </div>
  </div>
</div>`;
  });

  return html;
}

// Generate full HTML
function generate() {
  const student1Content = generateStudentContent("student1");
  const student2Content = generateStudentContent("student2");

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Learning Portal</title>

<style>
  :root {
    --s1: #1a3a4a;
    --s1-light: #e8f4f8;
    --s1-accent: #2eb8a0;
    --s2: #2d1a4a;
    --s2-light: #f0ecfa;
    --s2-accent: #9b6dff;
    --gold: #e8a020;
    --bg: #f7f5f0;
    --text: #1a1a1a;
    --muted: #666;
    --border: #ddd;
    --white: #fff;
    --shadow: 0 2px 16px rgba(0,0,0,0.08);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, sans-serif;
  background: var(--bg);
  margin: 0;
  padding: 10px;
}

  /* HEADER */
  header {
    background: linear-gradient(135deg, var(--s1) 0%, var(--s2) 100%);
    color: white;
    padding: 48px 40px 40px;
    position: relative;
    overflow: hidden;
  }
  header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  header::after {
    content: '';
    position: absolute;
    bottom: -40px; left: 30%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }
  .header-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--s1-accent);
    margin-bottom: 12px;
  }
  header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.15;
    margin-bottom: 16px;
    max-width: 700px;
  }
  header h1 em { color: var(--s1-accent); font-style: italic; }
  .header-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 24px;
  }
  .header-content {
    display: flex;
    align-items: flex-start;
    gap: 40px;
    justify-content: space-between;
  }
  .header-text {
    flex: 1;
  }
  .header-qr {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  .header-qr img {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    object-fit: contain;
  }

/* Sticky top controls */
.top-bar {
  position: sticky;
  top: 0;
  margin-top: 16px;
  background: #f5f7fa;
  padding-bottom: 10px;
  z-index: 100;
}

/* Student toggle */
.toggle {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 25px;
  background: #ddd;
  font-size: 14px;
  cursor: pointer;
}

.toggle button.active {
  background: #4f46e5;
  color: white;
}

/* Search */
.search {
  text-align: center;
}

.search input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Container */
.container {
  max-width: 100%;
  margin: auto;
}

/* Cards */
.card {
  background: white;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

.card.new {
  border-left: 5px solid #f59e0b;
}

/* Card header */
.card-header {
  padding: 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 15px;
  margin: 0;
}

/* Card body */
.card-body {
  padding: 10px;
}

/* Pills */
.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  flex: 1 1 calc(50% - 8px); /* 2 per row on mobile */
  text-align: center;
  padding: 10px;
  background: #e0e7ff;
  border-radius: 25px;
  text-decoration: none;
  font-size: 14px;
  color: #1e3a8a;
}

/* Tablet */
@media (min-width: 600px) {
  .pill {
    flex: 1 1 calc(33.33% - 8px);
  }
}
/* Mobile adjustments */
@media (max-width: 600px) {
  header {
    padding: 28px 18px 24px;
  }

  .header-label {
    font-size: 10px;
    margin-bottom: 10px;
  }

  .header-content {
    flex-direction: column;
    gap: 18px;
  }

  .pill {
    font-size: 13px;
    padding: 10px 12px;
  }

  .top-bar {
    padding: 10px 0 8px;
  }
}

/* Desktop */
@media (min-width: 900px) {
  .container {
    max-width: 900px;
  }

  .pill {
    flex: unset;
    padding: 6px 14px;
  }
}
</style>

</head>

<body>
<header>
  <div class="header-content">
    <div class="header-text">
      <div class="header-label">Learning Portal</div>
      <h1>Speaking & Listening Programme</h1>
    </div>
  </div>
</header>

<div class="top-bar">
    <div class="toggle">
    <button id="btn1" class="active" onclick="show('student1')">Student 1</button>
    <button id="btn2" onclick="show('student2')">Student 2</button>
    </div>

    <!--div class="search">
    <input type="text" placeholder="Search..." onkeyup="filter(this.value)">
    </div-->
</div>
<div class="container">
  <div id="student1">${student1Content}</div>
  <div id="student2" style="display:none;">${student2Content}</div>
</div>

<script>

function getIndexState() {
  return JSON.parse(localStorage.getItem("indexState") || '{"selectedStudent":"student1","openSessions":{}}');
}

function saveIndexState(state) {
  localStorage.setItem("indexState", JSON.stringify(state));
}

function setCardState(card, open) {
  const body = card.querySelector(".card-body");
  const icon = card.querySelector(".toggle-icon");
  body.style.display = open ? "block" : "none";
  icon.textContent = open ? "▲" : "▼";
}

// Toggle students
function show(student){
  document.getElementById("student1").style.display="none";
  document.getElementById("student2").style.display="none";
  document.getElementById(student).style.display="block";

  btn1.classList.remove("active");
  btn2.classList.remove("active");
  (student==="student1"?btn1:btn2).classList.add("active");

  const state = getIndexState();
  state.selectedStudent = student;
  saveIndexState(state);
  scrollToLatest();
}

function toggleCard(el){
  const card = el.closest(".card");
  const body = card.querySelector(".card-body");
  const open = body.style.display === "none";
  const student = card.closest("#student1") ? "student1" : "student2";
  const sessionId = card.dataset.session;
  if (!sessionId) return;

  document.querySelectorAll('#' + student + ' .card').forEach(c => {
    setCardState(c, c === card ? open : false);
  });

  const state = getIndexState();
  state.openSessions = state.openSessions || {};
  if (open) {
    state.openSessions[student] = sessionId;
  } else {
    delete state.openSessions[student];
  }
  saveIndexState(state);
}

// Search
function filter(text){
  text = text.toLowerCase();
  document.querySelectorAll(".card").forEach(card=>{
    card.style.display = card.innerText.toLowerCase().includes(text) ? "block":"none";
  });
}

// Auto-scroll ONLY to open (new) session
function scrollToLatest(){
  const openCard = document.querySelector(".card-body[style*='block']");
  if(openCard){
    openCard.scrollIntoView({behavior:"smooth"});
  }
}

window.onload = function(){
  const state = getIndexState();
  const student = state.selectedStudent || "student1";
  show(student);

  const studentState = state.openSessions ? state.openSessions[student] : null;
  let sessionId = null;
  if (typeof studentState === 'string') {
    sessionId = studentState;
  } else if (studentState && typeof studentState === 'object') {
    sessionId = Object.keys(studentState).find(id => studentState[id]);
  }

  if (sessionId) {
    document.querySelectorAll('#' + student + ' .card').forEach(card => {
      setCardState(card, card.dataset.session === sessionId);
    });
  }
  scrollToLatest();
};

</script>

</body>
</html>
`;

  fs.writeFileSync("index.html", html);
  console.log("✅ index.html generated");
}

generate();
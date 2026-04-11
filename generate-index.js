const fs = require("fs");
const path = require("path");

const rootDir = __dirname;

// ⭐ Define new sessions here
const newSessions = ["session3"]; // leave empty [] if none

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
<div class="card ${isNew ? "new" : ""}">
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
<title>Learning Portal</title>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  margin: 0;
  padding: 10px;
}

h1 {
  text-align: center;
  font-size: 22px;
  margin: 10px 0 15px;
}

/* Sticky top controls */
.top-bar {
  position: sticky;
  top: 0;
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

<h1>Learning Portal</h1>

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

// Toggle students
function show(student){
  document.getElementById("student1").style.display="none";
  document.getElementById("student2").style.display="none";
  document.getElementById(student).style.display="block";

  btn1.classList.remove("active");
  btn2.classList.remove("active");
  (student==="student1"?btn1:btn2).classList.add("active");

  scrollToLatest();
}

// Collapse toggle
function toggleCard(el){
  const body = el.nextElementSibling;
  const icon = el.querySelector(".toggle-icon");

  if(body.style.display==="none"){
    body.style.display="block";
    icon.textContent="▲";
  } else {
    body.style.display="none";
    icon.textContent="▼";
  }
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
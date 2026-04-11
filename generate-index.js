const fs = require("fs");
const path = require("path");

const rootDir = __dirname;

// ⭐ Define new sessions here
const newSessions = ["session2"]; // leave empty [] if none

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
body { font-family: Arial; background:#f5f7fa; padding:20px; margin:0; }
h1 { text-align:center; }

.toggle { display:flex; justify-content:center; gap:10px; margin-bottom:20px; }
.toggle button {
  padding:8px 18px; border:none; border-radius:20px; cursor:pointer;
}
.active { background:#4f46e5; color:white; }

.search { text-align:center; margin-bottom:20px; }
.search input {
  padding:8px; width:300px; border-radius:20px; border:1px solid #ccc;
}

.container { max-width:900px; margin:auto; }

.card {
  background:white; border-radius:12px; margin-bottom:15px;
  box-shadow:0 2px 6px rgba(0,0,0,0.05);
}

.card.new { border-left:5px solid #f59e0b; }

.card-header {
  padding:12px; cursor:pointer;
  display:flex; justify-content:space-between;
}

.card-body { padding:10px 15px; }

.pill-group { display:flex; flex-wrap:wrap; gap:8px; }

.pill {
  padding:6px 14px;
  background:#e0e7ff;
  border-radius:999px;
  text-decoration:none;
  font-size:13px;
  color:#1e3a8a;
}
</style>

</head>

<body>

<h1>Learning Portal</h1>

<div class="toggle">
  <button id="btn1" class="active" onclick="show('student1')">Student 1</button>
  <button id="btn2" onclick="show('student2')">Student 2</button>
</div>

<div class="search">
  <input type="text" placeholder="Search..." onkeyup="filter(this.value)">
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
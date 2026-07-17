const loginForm      = document.getElementById("loginForm");
const usernameInput  = document.getElementById("adminUsername");
const passwordInput  = document.getElementById("adminPassword");
const loginStatus    = document.getElementById("loginStatus");
const toggleBtn      = document.getElementById("togglePassword");
const searchInput    = document.getElementById("directorySearch");
const searchStatus   = document.getElementById("searchStatus");
const addMemberForm  = document.getElementById("addMemberForm");
const newFirstName   = document.getElementById("newFirstName");
const newLastName    = document.getElementById("newLastName");
const newGroup       = document.getElementById("newGroup");
const adminBody      = document.getElementById("adminBody");
const boardBody      = document.getElementById("boardBody");
const officerBody    = document.getElementById("officerBody");
const envBanner      = document.getElementById("envBanner");
const rowTemplate    = document.getElementById("memberRowTemplate");

const pageHeader   = document.querySelector("header.text-center");
const allTables    = document.querySelectorAll("table.table-dark-custom");
const allDirBodies = document.querySelectorAll("table.table-dark-custom tbody");

function getBodyForGroup(group) {
  if (group === "board")   return boardBody;
  if (group === "officer") return officerBody;
  return adminBody;
}

function setStatus(el, message, kind) {
  if (!el) return;
  el.textContent = message;                    
  el.classList.remove("status-ok", "status-error");
  if (kind) el.classList.add("status-" + kind);
}
 
console.log("Admin Hub ready —", allTables.length, "directory tables found.");


function handleLoginSubmit(event) {
  event.preventDefault();
 
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;
  const problems = [];
 
  if (user.length < 4) {
    problems.push("Username must be at least 4 characters.");
  }
  if (!/^[A-Za-z0-9_]+$/.test(user)) {
    problems.push("Username may only contain letters, numbers, and underscores.");
  }
  if (pass.length < 8) {
    problems.push("Password must be at least 8 characters.");
  }
  if (!/[0-9]/.test(pass)) {
    problems.push("Password must include at least one number.");
  }
 
  if (problems.length > 0) {
  
    loginStatus.innerHTML =
      "<strong>Could not sign in:</strong><ul><li>" +
      problems.join("</li><li>") +
      "</li></ul>";
    loginStatus.classList.remove("status-ok");
    loginStatus.classList.add("status-error");
    usernameInput.classList.toggle("is-invalid", user.length < 4);
    passwordInput.classList.toggle("is-invalid", pass.length < 8);
    return;
  }
 
  usernameInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
  setStatus(loginStatus, "Credentials look good. Signing in\u2026", "ok");
}

function handleLoginInput(event) {
  const field = event.target;
  if (field.value.trim().length > 0) {
    field.classList.remove("is-invalid");
  }
}
 
if (loginForm) {
  loginForm.addEventListener("submit", handleLoginSubmit);
  loginForm.addEventListener("input", handleLoginInput);
}


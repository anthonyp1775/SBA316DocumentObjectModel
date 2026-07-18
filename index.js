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

function handleTogglePassword() {
  const isHidden = passwordInput.getAttribute("type") === "password";

  passwordInput.setAttribute("type", isHidden ? "text" : "password");
  toggleBtn.setAttribute("aria-pressed", String(isHidden));

  toggleBtn.textContent = isHidden ? "Hide" : "Show";
  toggleBtn.classList.toggle("btn-active", isHidden);

  passwordInput.style.letterSpacing = isHidden ? "normal" : "0.15em";
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", handleTogglePassword);
}

function handleDirectorySearch(event) {
  const term = searchInput.value.trim().toLowerCase();
  let matches = 0;

allDirBodies.forEach(function (body) {
    const rows = body.querySelectorAll("tr");
 

    
    rows.forEach(function (row) {
        const firstCell = row.firstElementChild;
      const lastCell  = firstCell.nextElementSibling;
      const fullName  = (firstCell.textContent + " " + lastCell.textContent).toLowerCase();
 
      const hit = term === "" || fullName.indexOf(term) !== -1;
      row.style.display = hit ? "" : "none";
      row.classList.toggle("row-match", hit && term !== "");
      if (hit) matches++;
    });
  });
 
  if (term === "") {
    setStatus(searchStatus, "", null);
  } else {
    setStatus(searchStatus, matches + " member(s) matched \u201C" + term + "\u201D.", "ok");
  }
}
 
if (searchInput) {
  searchInput.addEventListener("input", handleDirectorySearch);
}

function buildMemberRow(first, last) {

  const row       = document.createElement("tr");
  const firstCell = document.createElement("td");
  const lastCell  = document.createElement("td");
 
  firstCell.textContent = first;
  lastCell.textContent  = last;

  row.appendChild(firstCell);
  row.appendChild(lastCell);
  row.classList.add("row-new");

    return row;
}

function handleAddMember(event) {
  event.preventDefault();
 
  const first = newFirstName.value.trim();
  const last  = newLastName.value.trim();
 
  if (first === "" || last === "") {
    setStatus(searchStatus, "Both first and last name are required.", "error");
    return;
  }
 
  const row  = buildMemberRow(first, last);
  const body = getBodyForGroup(newGroup.value);

  body.prepend(row);
 
  setStatus(searchStatus, first + " " + last + " added to the directory.", "ok");
  addMemberForm.reset();
  newFirstName.focus();
}
 
if (addMemberForm) {
  addMemberForm.addEventListener("submit", handleAddMember);
}

const FOUNDING_MEMBERS = [
  { first: "Ada",    last: "Vance",   group: "board" },
  { first: "Rex",    last: "Calloway", group: "board" },
  { first: "Nadia",  last: "Okonjo",  group: "officer" },
  { first: "Sal",    last: "Moreno",  group: "officer" }
];

function renderRoster(members) {
  const fragments = {
    admin:   document.createDocumentFragment(),
    board:   document.createDocumentFragment(),
    officer: document.createDocumentFragment()
  };



    members.forEach(function (member) {
    const clone = rowTemplate.content.cloneNode(true);
    const cells = clone.querySelectorAll("td");
 
    cells[0].textContent = member.first;
    cells[1].textContent = member.last;
 
    fragments[member.group].appendChild(clone);
  });

  adminBody.appendChild(fragments.admin);
  boardBody.appendChild(fragments.board);
  officerBody.appendChild(fragments.officer);
}
 
if (rowTemplate) {
  renderRoster(FOUNDING_MEMBERS);
}

function describeEnvironment() {
    const screenSize = window.screen.width + "\u00D7" + window.screen.height;
    const online = window.navigator.onLine ? "online" : "offline";
    const layout = window.innerWidth < 768 ? "compact" : "full";
    return "Session: " + layout + " layout \u00B7 " + screenSize + " display \u00B7 " + online;
}

function handleResize() {
      envBanner.innerText = describeEnvironment();
}
      if (envBanner) {
  handleResize();
    let resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(handleResize, 150);
  });
      }
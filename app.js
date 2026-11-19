/* ==========================================================
   GTA VI HEIST SIMULATOR — interactive layer
   The checks below are a 1:1 translation of original-copy.js.
   ========================================================== */

const ORIGINAL_MESSAGES = {
  success: "Here we go again, Mission can be started! Good Luck!",
  money: "Ah shit, Mission can't be started as you don't have enough money. Poor you xD. Bring atleast $10,000\n",
  car: "Are you serious? You wanna go on a heist by walk? Bring a Gate Way Car!\n",
  partner: "Just like life partner is important to SRURVIVE life, crime partner is also important to SUCCEED a heist. Convince your partner!\n",
  weapon: "So you gonna fight there with your dirty punches huh? Go and buy a damn weapon!\n",
  allMissing: "You're going for heist, not on a weekend party! Mission can't be started, bring all necessary things\n"
};

// Same starting values as the original script.
const DEFAULTS = { money: 15000, gateWayCar: true, partner: false, weapon: true };
const state = { ...DEFAULTS };

const moneyRange = document.getElementById("moneyRange");
const moneyValue = document.getElementById("moneyValue");
const moneyBarFill = document.getElementById("moneyBarFill");
const output = document.getElementById("output");
const statusPill = document.getElementById("statusPill");
const checklist = document.getElementById("checklist");
const app = document.getElementById("app");
const flash = document.getElementById("flash");
const confettiLayer = document.getElementById("confettiLayer");

const moneyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
let runId = 0;

const checks = () => ({
  money: state.money >= 10000,
  car: state.gateWayCar,
  partner: state.partner,
  weapon: state.weapon
});

function renderSetup() {
  moneyRange.value = state.money;
  moneyValue.textContent = moneyFormat.format(state.money);
  moneyBarFill.style.width = `${Math.min(100, (state.money / 30000) * 100)}%`;

  document.querySelectorAll(".toggle").forEach((button) => {
    const on = state[button.dataset.key];
    button.classList.toggle("is-on", on);
    button.setAttribute("aria-pressed", String(on));
  });

  const c = checks();
  const allGood = c.money && c.car && c.partner && c.weapon;
  statusPill.className = `status-pill ${allGood ? "ready" : "blocked"}`;
  statusPill.textContent = allGood
    ? "● MISSION READY — GO MAKE THE SCORE"
    : "● MISSION BLOCKED — FIX YOUR SETUP";

  const items = [
    ["money", "CASH ≥ $10,000"],
    ["car", "GATEWAY CAR"],
    ["partner", "PARTNER"],
    ["weapon", "WEAPON"]
  ];
  checklist.innerHTML = items
    .map(([key, label]) => `<div class="check ${c[key] ? "ok" : "bad"}">${c[key] ? "✓" : "✗"} ${label}</div>`)
    .join("");
}

function setDefaultLog() {
  output.innerHTML = '<p class="line muted"><span class="prompt">›</span> Awaiting your orders, boss. Hit START HEIST.</p>';
}

function typeLine(text, kind, token) {
  return new Promise((resolve) => {
    const line = document.createElement("p");
    line.className = `line ${kind} cursor`;
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "›";
    const body = document.createElement("span");
    line.append(prompt, body);
    output.appendChild(line);

    let i = 0;
    const timer = setInterval(() => {
      if (token !== runId) {
        clearInterval(timer);
        line.remove();
        resolve();
        return;
      }
      body.textContent = text.slice(0, ++i);
      output.scrollTop = output.scrollHeight;
      if (i >= text.length) {
        clearInterval(timer);
        line.classList.remove("cursor");
        resolve();
      }
    }, 7);
  });
}

// Reproduces the exact order of the if-statements in the original code.
function buildMissionLog() {
  const log = [];
  if (state.money >= 10000 && state.gateWayCar && state.partner && state.weapon) {
    log.push([ORIGINAL_MESSAGES.success, "success"]);
  }
  if (state.money < 10000) log.push([ORIGINAL_MESSAGES.money, "error"]);
  if (!state.gateWayCar) log.push([ORIGINAL_MESSAGES.car, "error"]);
  if (!state.partner) log.push([ORIGINAL_MESSAGES.partner, "error"]);
  if (!state.weapon) log.push([ORIGINAL_MESSAGES.weapon, "error"]);
  if (state.money < 10000 && !state.gateWayCar && !state.partner && !state.weapon) {
    log.push([ORIGINAL_MESSAGES.allMissing, "special"]);
  }
  return log;
}

function replayAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // force reflow so the animation can restart
  element.classList.add(className);
}

function celebrate() {
  replayAnimation(flash, "go");
  const colors = ["#ff2d95", "#00e5ff", "#b967ff", "#ffd166", "#39ff88"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dur", `${1.6 + Math.random() * 1.6}s`);
    piece.style.setProperty("--delay", `${Math.random() * 0.5}s`);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
  }
  setTimeout(() => { confettiLayer.innerHTML = ""; }, 4200);
}

async function runHeist() {
  const token = ++runId;
  const log = buildMissionLog();
  const allGood = log.some(([, kind]) => kind === "success");

  output.innerHTML = "";
  await typeLine("Running heist check...", "muted", token);
  for (const [text, kind] of log) {
    await typeLine(text, kind, token);
  }
  if (token !== runId) return;

  if (allGood) celebrate();
  else replayAnimation(app, "shake");
}

moneyRange.addEventListener("input", (event) => {
  state.money = Number(event.target.value);
  renderSetup();
});

document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    state[key] = !state[key];
    renderSetup();
  });
});

document.getElementById("runBtn").addEventListener("click", runHeist);
document.getElementById("clearBtn").addEventListener("click", () => { runId++; setDefaultLog(); });
document.getElementById("resetBtn").addEventListener("click", () => {
  runId++;
  Object.assign(state, DEFAULTS);
  renderSetup();
  setDefaultLog();
});

renderSetup();

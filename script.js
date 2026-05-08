const stages = [
  {
    number: "01",
    title: "Appraise: See the limits first",
    body: "Vessel condition, draft, stability, charts, publications, tides, warnings, port limits, security and environmental requirements must be confirmed before the route is drawn.",
    list: ["Confirm official charts, nautical publications and navigational warnings.", "Identify IALA, radar marks, fixing methods and restricted waters.", "Include safety, security, environmental and contact-point data in the voyage file."],
  },
  {
    number: "02",
    title: "Plan: Draw the route to the berth",
    body: "The passage plan must be berth-to-berth, covering departure, pilot stations, route sections, shifting, deviation, arrival berth and contingency options.",
    list: ["Build the waypoint safety matrix.", "Mark No-Go areas, tide windows, air draft and restricted UKC.", "Put hold points, abort points and safe waiting areas into the briefing."],
  },
  {
    number: "03",
    title: "Verify: Challenge the route with a second view",
    body: "Route scan, UKC, air draft, T&P/AIO, alarm settings, SCAMIN control and VoyVis review must be complete before Master approval.",
    list: ["The ECDIS corridor must cover the cross-track area.", "Switch SCAMIN off for planning and safety checking where the system permits.", "When VoyVis finds a doubt, correct the formal controlling route first."],
  },
  {
    number: "04",
    title: "Brief: Put the team on the same chart",
    body: "The Master, OOW, pilot, engine room and deck support must understand the next danger point, speed limit, tide window, machinery state and Master-call conditions.",
    list: ["Use closed-loop communication for helm orders, engine orders, pilot advice and VTS instructions.", "Raise the watch to Level III in restricted waters.", "Differences must be challenged, clarified and recorded."],
  },
  {
    number: "05",
    title: "Monitor: Ask why every deviation is happening",
    body: "The OOW navigates according to the approved plan, COLREG, Master standing orders and night orders, while fixing the vessel by independent methods.",
    list: ["In coastal and restricted waters, prefer visual, radar, parallel index and echo sounder cross-checks.", "BNWAS and other alarms must not be acknowledged without understanding their meaning.", "Call the Master early when traffic, visibility, weather or equipment condition deteriorates."],
  },
  {
    number: "06",
    title: "Review: Turn near misses into the next defence",
    body: "After arrival, the Master leads a factual review of hazards, route reasonableness, missed factors, pilotage differences and information that should be updated.",
    list: ["Preserve VDR where needed before overwrite.", "Feed lessons back into the route library, forms and company procedure.", "Treat near misses as improvement opportunities, not as personal blame."],
  },
];

const risks = {
  collision: {
    title: "Collision Risk",
    body: "Maintain proper lookout, radar plotting, CPA/TCPA assessment and COLREG judgement. AIS is supporting information only; it cannot replace visual and radar confirmation.",
    action: "Immediate action: safe speed, early avoiding action and call the Master when required.",
  },
  grounding: {
    title: "Grounding and No-Go",
    body: "The route must not cross No-Go boundaries. Any waypoint or leg touching dangerous water must be replanned or controlled by a Master-approved risk assessment.",
    action: "Immediate action: stop approval, correct the route and rerun the ECDIS route scan.",
  },
  ukc: {
    title: "UKC and Tide Window",
    body: "When UKC is below the normal standard or depth reliability is uncertain, complete a restricted UKC risk assessment with clear hold points, abort points and minimum acceptable UKC.",
    action: "Immediate action: confirm draft, squat, tide, speed, machinery readiness and safe waiting area.",
  },
  ecdis: {
    title: "ECDIS Failure",
    body: "During single or dual ECDIS failure, stabilize navigation risk first: call the Master, increase lookout, reduce speed, shift to backup navigation and cross-check with radar, visual and independent GNSS fixing.",
    action: "Immediate action: within 0-2 minutes, confirm the failure, scan for collision or grounding risk and establish backup.",
  },
  pilotage: {
    title: "Pilotage and Port Approach",
    body: "The pilot is an adviser. The Master and OOW still monitor independently. If pilot advice departs from the plan or compresses the safety margin, challenge, slow down, clarify or let the Master take the conn.",
    action: "Immediate action: Master/Pilot Exchange confirms route, tugs, abort points, speed and communication language.",
  },
};

const header = document.querySelector("[data-header]");
const tabs = document.querySelectorAll(".loop-tab");
const stageNumber = document.querySelector("[data-stage-number]");
const stageTitle = document.querySelector("[data-stage-title]");
const stageBody = document.querySelector("[data-stage-body]");
const stageList = document.querySelector("[data-stage-list]");
const riskButtons = document.querySelectorAll("[data-risk-panel]");
const riskTitle = document.querySelector("[data-risk-title]");
const riskBody = document.querySelector("[data-risk-body]");
const riskAction = document.querySelector("[data-risk-action]");
const checklist = document.querySelector("[data-checklist]");
const progressCount = document.querySelector("[data-progress-count]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressText = document.querySelector("[data-progress-text]");
const decisionButton = document.querySelector("[data-decision]");
const decisionResult = document.querySelector("[data-decision-result]");
const homeReset = document.querySelector("[data-home-reset]");
const voyvisOpeners = document.querySelectorAll("[data-open-voyvis], [data-open-voyvis-panel]");
const voyvisIntroLinks = document.querySelectorAll("[data-voyvis-intro]");
const voyvisShell = document.querySelector("#voyvis-embed");
const voyvisFrame = document.querySelector(".voyvis-frame");

function loadVoyVisFrame() {
  if (!voyvisFrame) return;
  const currentSrc = voyvisFrame.getAttribute("src") || "";

  if (!currentSrc.includes("voyvis.html")) {
    voyvisFrame.setAttribute("src", voyvisFrame.dataset.src || "voyvis.html?embed=1");
  }
}

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function openVoyVis(event) {
  if (event) event.preventDefault();
  loadVoyVisFrame();
  voyvisShell?.classList.remove("is-collapsed");
  document.body.classList.add("voyvis-active");
  document.querySelectorAll("[data-open-voyvis]").forEach((opener) => opener.setAttribute("aria-expanded", "true"));
  window.scrollTo({ top: 0, behavior: "auto" });
}

function resetToStart(event) {
  if (event) event.preventDefault();
  document.body.classList.remove("voyvis-active");
  voyvisShell?.classList.remove("is-collapsed");
  document.querySelectorAll("[data-open-voyvis]").forEach((opener) => opener.setAttribute("aria-expanded", "false"));
  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showVoyVisIntro(event) {
  if (event) event.preventDefault();
  loadVoyVisFrame();
  document.body.classList.remove("voyvis-active");
  voyvisShell?.classList.remove("is-collapsed");
  document.querySelectorAll("[data-open-voyvis]").forEach((opener) => opener.setAttribute("aria-expanded", "false"));
  document.querySelector("#voyvis-tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setStage(index) {
  const stage = stages[index];
  stageNumber.textContent = stage.number;
  stageTitle.textContent = stage.title;
  stageBody.textContent = stage.body;
  stageList.innerHTML = stage.list.map((item) => `<li>${item}</li>`).join("");

  tabs.forEach((tab) => {
    const isActive = Number(tab.dataset.step) === index;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function setRisk(key) {
  const risk = risks[key];
  riskTitle.textContent = risk.title;
  riskBody.textContent = risk.body;
  riskAction.textContent = risk.action;

  riskButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.riskPanel === key);
  });
}

function updateProgress() {
  const checks = [...checklist.querySelectorAll("input")];
  const total = checks.length;
  const done = checks.filter((input) => input.checked).length;
  const percent = Math.round((done / total) * 100);

  progressCount.textContent = done;
  progressBar.style.width = `${percent}%`;

  if (done === total) {
    progressText.textContent = "The safety evidence chain is complete and ready for the Master's final Go / No-Go decision.";
  } else if (done >= 5) {
    progressText.textContent = "Major controls are in place, but key evidence is still open.";
  } else if (done > 0) {
    progressText.textContent = "The check has started. Continue clearing unconfirmed risk.";
  } else {
    progressText.textContent = "No safety evidence chain has been established yet.";
  }
}

function runDecision() {
  const checks = [...checklist.querySelectorAll("input")];
  const done = checks.filter((input) => input.checked).length;
  decisionResult.classList.remove("is-safe", "is-hold");

  if (done === checks.length) {
    decisionResult.textContent = "GO conditions are ready: before entry, the Master must still confirm actual depth, traffic, weather, machinery and pilotage information have not deteriorated.";
    decisionResult.classList.add("is-safe");
    return;
  }

  decisionResult.textContent = "HOLD / NO-GO: control points are still open. The procedure requires holding outside the safety boundary until evidence is complete.";
  decisionResult.classList.add("is-hold");
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
tabs.forEach((tab) => tab.addEventListener("click", () => setStage(Number(tab.dataset.step))));
riskButtons.forEach((button) => button.addEventListener("click", () => setRisk(button.dataset.riskPanel)));
checklist.addEventListener("change", updateProgress);
decisionButton.addEventListener("click", runDecision);
voyvisOpeners.forEach((opener) => opener.addEventListener("click", openVoyVis));
voyvisIntroLinks.forEach((link) => link.addEventListener("click", showVoyVisIntro));
homeReset.addEventListener("click", resetToStart);
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
updateProgress();

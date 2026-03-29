/* ═══════════════════════════════════════════════
   JARVIX — NEURAL COMMAND INTERFACE
   All original functionality preserved + extended
   ═══════════════════════════════════════════════ */

/* ── ELEMENT REFS (original IDs preserved) ─────── */
const sendBtn   = document.getElementById("sendBtn");
const voiceBtn  = document.getElementById("voiceBtn");
const textInput = document.getElementById("textInput");
const chatBox   = document.getElementById("chatBox");
const micBtn    = document.getElementById("micBtn");

/* ── STATE ─────────────────────────────────────── */
let voices          = [];
let currentLang     = "en";
let currentPersona  = "friendly";
let autoSpeak       = false;
let preferredGender = "female";
let isThinking      = false;
let currentUtterance = null;
let msgCount        = 0;

const PERSONAS = {
  friendly:     "You are JARVIX, a sophisticated and helpful neural AI assistant. Be warm, clear, and supportive.",
  professional: "You are JARVIX, a precision tactical AI system. Be concise, structured, and highly accurate.",
  funny:        "You are JARVIX, a witty AI assistant with humor protocols active. Be helpful but entertaining and playful."
};

/* ── BOOT SEQUENCE ─────────────────────────────── */
const BOOT_MESSAGES = [
  "LOADING CORE MODULES",
  "INITIALIZING NEURAL PATHWAYS",
  "CALIBRATING VOICE SYSTEMS",
  "LOADING LANGUAGE MATRIX",
  "ESTABLISHING UPLINK",
  "SYSTEM READY"
];

window.addEventListener("DOMContentLoaded", () => {
  const bootScreen = document.getElementById("bootScreen");
  const hudWrapper = document.getElementById("hudWrapper");
  const bootStatus = document.getElementById("bootStatus");
  const bootFill   = document.getElementById("bootFill");

  let step = 0;
  const interval = setInterval(() => {
    step++;
    if (step < BOOT_MESSAGES.length) {
      bootStatus.textContent = BOOT_MESSAGES[step];
    } else {
      clearInterval(interval);
    }
  }, 380);

  setTimeout(() => {
    bootScreen.classList.add("hidden");
    hudWrapper.classList.add("active");
    initAll();
  }, 2800);
});

/* ── INIT ALL ───────────────────────────────────── */
function initAll() {
  loadVoices();
  initCanvas();
  initRadar();
  initClock();
  initNeuralFlicker();
  injectSVGDefs();
  loadChat();
  setLang("en");
  logActivity("Interface activated");
}

/* ── HUD CANVAS (particles + energy lines) ─────── */
function initCanvas() {
  const canvas = document.getElementById("hudCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [], energyLines = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
    initEnergyLines();
  }

  function initParticles() {
    particles = Array.from({length: 55}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      col: Math.random() > .55 ? "255,34,68" : "0,170,255",
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function initEnergyLines() {
    energyLines = Array.from({length: 8}, () => ({
      x1: Math.random() * W, y1: Math.random() * H,
      x2: Math.random() * W, y2: Math.random() * H,
      progress: Math.random(),
      speed: .002 + Math.random() * .003,
      col: Math.random() > .5 ? "255,34,68" : "0,170,255",
      alpha: .12 + Math.random() * .1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Energy lines (HUD scan lines)
    energyLines.forEach(l => {
      l.progress += l.speed;
      if (l.progress > 1) {
        l.progress = 0;
        l.x1 = Math.random() * W; l.y1 = Math.random() * H;
        l.x2 = Math.random() * W; l.y2 = Math.random() * H;
      }
      const cx = l.x1 + (l.x2 - l.x1) * l.progress;
      const cy = l.y1 + (l.y2 - l.y1) * l.progress;

      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = `rgba(${l.col},${l.alpha})`;
      ctx.lineWidth = .6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${l.col},0.6)`;
      ctx.fill();
    });

    // Particles
    particles.forEach((p, i) => {
      p.phase += .005;
      const a = .2 + .2 * Math.sin(p.phase);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${a})`;
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${p.col},${.04 * (1 - d/100)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* ── RADAR CANVAS ──────────────────────────────── */
function initRadar() {
  const canvas = document.getElementById("radarCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const cx = 80, cy = 80, r = 72;
  let angle = 0;
  let blips = [];

  function addBlip() {
    if (blips.length < 6) {
      blips.push({
        x: cx + (Math.random() - .5) * r * 1.4,
        y: cy + (Math.random() - .5) * r * 1.4,
        life: 1, decay: .008 + Math.random() * .006
      });
    }
  }

  setInterval(addBlip, 1200);

  function draw() {
    ctx.clearRect(0, 0, 160, 160);

    // Background
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(4,6,22,0.85)";
    ctx.fill();

    // Grid rings
    [r*.25, r*.5, r*.75, r].forEach(rad => {
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,170,255,.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Cross lines
    ctx.strokeStyle = "rgba(0,170,255,.1)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();

    // Outer border
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,170,255,.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sweep
    const grad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, angle - .8, angle)
      : null;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - 1.2, angle);
    ctx.closePath();
    ctx.clip();
    const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    sg.addColorStop(0, "rgba(255,34,68,0.0)");
    sg.addColorStop(.7, "rgba(255,34,68,0.12)");
    sg.addColorStop(1,  "rgba(255,34,68,0.25)");
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.restore();

    // Sweep line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(r, 0);
    ctx.strokeStyle = "rgba(255,34,68,.8)";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#ff2244"; ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();

    angle += .025;

    // Blips
    blips = blips.filter(b => b.life > 0);
    blips.forEach(b => {
      const d = Math.hypot(b.x - cx, b.y - cy);
      if (d <= r) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,150,${b.life})`;
        ctx.shadowColor = "#00ff96"; ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      b.life -= b.decay;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── CLOCK ──────────────────────────────────────── */
function initClock() {
  const el = document.getElementById("gaugeTime");
  if (!el) return;
  setInterval(() => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  }, 1000);
}

/* ── NEURAL BAR FLICKER ─────────────────────────── */
function initNeuralFlicker() {
  setInterval(() => {
    const val = Math.floor(30 + Math.random() * 60);
    const bar = document.getElementById("neuralBar");
    const pct = document.getElementById("neuralPct");
    if (bar) bar.style.width = val + "%";
    if (pct) pct.textContent = val + "%";
  }, 2000);
}

/* ── SVG DEFS (arc gradient) ───────────────────── */
function injectSVGDefs() {
  const svg = document.querySelector(".arc-ring");
  if (!svg) return;
  const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
  defs.innerHTML = `
    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#ff2244"/>
      <stop offset="100%" stop-color="#00aaff"/>
    </linearGradient>
  `;
  svg.prepend(defs);
}

/* ── VOICES ─────────────────────────────────────── */
function loadVoices() {
  voices = speechSynthesis.getVoices();
}
speechSynthesis.onvoiceschanged = loadVoices;

/* ── NOTIFICATION SOUND ─────────────────────────── */
function playNotif() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [[880,.08],[660,.06],[440,.04]].forEach(([f,v], i) => {
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.connect(g); g.connect(ac.destination);
      osc.frequency.value = f;
      g.gain.setValueAtTime(v, ac.currentTime + i * .08);
      g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + i * .08 + .15);
      osc.start(ac.currentTime + i * .08);
      osc.stop(ac.currentTime + i * .08 + .18);
    });
  } catch(e) {}
}

/* ── STATUS DISPLAY ─────────────────────────────── */
function setStatus(text, type = "ready") {
  const arcMain = document.getElementById("arcMainText");
  const arcSub  = document.getElementById("statusText");
  if (arcSub) arcSub.textContent = text.toUpperCase();

  const statusColors = {
    ready:    "#00aaff",
    thinking: "#ff2244",
    speaking: "#ffd700",
    error:    "#ff2244"
  };

  if (arcMain) {
    arcMain.style.color = statusColors[type] || statusColors.ready;
    arcMain.style.textShadow = `0 0 10px ${statusColors[type] || statusColors.ready}`;
  }
}

/* ── THINKING RING ──────────────────────────────── */
function showThinking(show) {
  const el = document.getElementById("thinkingRing");
  if (el) el.classList.toggle("active", show);
  if (show) setStatus("Processing", "thinking");
}

/* ── WAVE HUD ───────────────────────────────────── */
function showWave(show) {
  const el = document.getElementById("waveformOverlay");
  if (el) el.classList.toggle("active", show);
}

/* ── ACTIVITY LOG ───────────────────────────────── */
function logActivity(text) {
  const log = document.getElementById("activityLog");
  if (!log) return;
  const item = document.createElement("div");
  item.className = "alog-item";
  item.textContent = "◈ " + text;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
  // Keep max 12 items
  while (log.children.length > 12) log.removeChild(log.firstChild);
}

/* ── TIMESTAMP ──────────────────────────────────── */
function ts() {
  return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
}

/* ── ESCAPE HTML ────────────────────────────────── */
function esc(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ── ADD MESSAGE ────────────────────────────────── */
function addMessage(msg, type) {
  const chips   = document.getElementById("suggestionChips");
  const welcome = chatBox.querySelector(".welcome");
  if (chips)   chips.style.display = "none";
  if (welcome) welcome.remove();

  msgCount++;
  const isUser = type === "user";
  const row = document.createElement("div");
  row.className = `msg-row ${isUser ? "u-row" : "b-row"}`;

  row.innerHTML = `
    <div class="msg-meta">
      <div class="m-avatar">${isUser ? "USR" : "JVX"}</div>
      <span>${isUser ? "OPERATOR" : "JARVIX"}</span>
      <span>${ts()}</span>
      <span>#${String(msgCount).padStart(4,"0")}</span>
    </div>
    <div class="msg-wrap">
      <div class="bubble">${esc(msg)}</div>
      <button class="copy-btn" title="Copy" onclick="copyMsg(this)">⊕</button>
    </div>
  `;

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  saveChat();
}

/* ── COPY ───────────────────────────────────────── */
function copyMsg(btn) {
  const text = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✓";
    setTimeout(() => btn.textContent = "⊕", 1800);
  });
}

/* ── TYPING INDICATOR ───────────────────────────── */
function addTyping() {
  const row = document.createElement("div");
  row.className = "msg-row b-row typing-row";
  row.id = "typingIndicator";
  row.innerHTML = `
    <div class="msg-meta">
      <div class="m-avatar">JVX</div>
      <span>JARVIX</span>
      <span>COMPUTING...</span>
    </div>
    <div class="msg-wrap">
      <div class="bubble">
        <div class="td"></div><div class="td"></div><div class="td"></div>
      </div>
    </div>
  `;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

/* ── STREAMING REPLY ────────────────────────────── */
async function addBotStreaming(msg) {
  const row = document.createElement("div");
  msgCount++;
  row.className = "msg-row b-row";
  row.innerHTML = `
    <div class="msg-meta">
      <div class="m-avatar">JVX</div>
      <span>JARVIX</span>
      <span>${ts()}</span>
      <span>#${String(msgCount).padStart(4,"0")}</span>
    </div>
    <div class="msg-wrap">
      <div class="bubble" id="streamBubble"></div>
      <button class="copy-btn" title="Copy" onclick="copyMsg(this)">⊕</button>
    </div>
  `;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;

  const bubble = document.getElementById("streamBubble");
  const words  = msg.split(" ");
  bubble.textContent = "";

  for (let i = 0; i < words.length; i++) {
    bubble.textContent += (i === 0 ? "" : " ") + words[i];
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(r => setTimeout(r, 22 + Math.random() * 20));
  }

  bubble.removeAttribute("id");
  saveChat();
}

/* ── SAVE / LOAD ────────────────────────────────── */
function saveChat() {
  localStorage.setItem("jarvix_chat_v1", chatBox.innerHTML);
}
function loadChat() {
  const saved = localStorage.getItem("jarvix_chat_v1");
  if (saved && saved.trim()) {
    chatBox.innerHTML = saved;
    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("suggestionChips").style.display = "none";
  } else {
    showWelcome();
  }
}

/* ── LANGUAGE  (original function preserved) ─────── */
function setLang(lang) {
  currentLang = lang;
  setStatus("Language: " + lang.toUpperCase());
  document.querySelectorAll(".lang-toggle span").forEach(el => el.classList.remove("active"));
  const el = document.getElementById("lang-" + lang);
  if (el) el.classList.add("active");
  logActivity("Language set: " + lang.toUpperCase());
}

/* ── TRANSLATE  (original function preserved) ─────── */
async function translateText(text) {
  try {
    const res  = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${currentLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0];
  } catch(e) { return text; }
}

/* ── CHAT API  (original function preserved) ─────── */
async function chatWithAI(message) {
  try {
    const res  = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message, system: PERSONAS[currentPersona] || PERSONAS.friendly})
    });
    const data = await res.json();
    return data.reply || "⚠️ No response received from neural core.";
  } catch(e) {
    return "⚠️ JARVIX backend offline — launch app.py to connect.";
  }
}

/* ── SEND  (original listener preserved) ─────────── */
sendBtn.addEventListener("click", async () => {
  if (isThinking) return;
  const text = textInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  textInput.value = "";
  autoResize();
  logActivity("Query received");

  isThinking = true;
  sendBtn.classList.add("loading");
  showThinking(true);
  addTyping();

  let reply = await chatWithAI(text);
  reply     = await translateText(reply);

  removeTyping();
  showThinking(false);
  isThinking = false;
  sendBtn.classList.remove("loading");

  await addBotStreaming(reply);
  playNotif();
  setStatus("Ready");
  logActivity("Response transmitted");

  if (autoSpeak) speakText(reply);
});

/* ── SPEAK  (original voiceBtn listener preserved) ── */
async function speakText(text) {
  speechSynthesis.cancel();
  const translated = await translateText(text);
  const utter = new SpeechSynthesisUtterance(translated);

  let v = speechSynthesis.getVoices();
  if (!v.length) {
    await new Promise(r => speechSynthesis.onvoiceschanged = r);
    v = speechSynthesis.getVoices();
  }

  const langCode = currentLang === "ta" ? "ta" : currentLang === "hi" ? "hi" : "en";
  let voice = v.find(x => {
    const langOk   = x.lang.toLowerCase().startsWith(langCode);
    const genderOk = preferredGender === "female"
      ? /female|woman|samantha|victoria|karen|zira|nicky/i.test(x.name)
      : /male|man|david|daniel|alex|thomas/i.test(x.name);
    return langOk && genderOk;
  });
  if (!voice) voice = v.find(x => x.lang.toLowerCase().startsWith(langCode));
  if (!voice) voice = v[0];

  utter.voice = voice;
  currentUtterance = utter;

  utter.onstart = () => { setStatus("Transmitting audio", "speaking"); showWave(true); logActivity("Audio output active"); };
  utter.onend   = () => { setStatus("Ready"); showWave(false); currentUtterance = null; };
  utter.onerror = () => { showWave(false); setStatus("Ready"); };

  speechSynthesis.resume();
  speechSynthesis.speak(utter);
}

function stopSpeaking() {
  speechSynthesis.cancel();
  showWave(false);
  setStatus("Ready");
}

voiceBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  if (!text) {
    setStatus("No input detected", "error");
    logActivity("ERROR: No text to speak");
    setTimeout(() => setStatus("Ready"), 2000);
    return;
  }
  await speakText(text);
});

/* ── MIC  (original function preserved) ──────────── */
function startMic() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert("Chrome required for voice input."); return; }

  const rec = new SR();
  rec.lang = currentLang === "ta" ? "ta-IN" : currentLang === "hi" ? "hi-IN" : "en-US";

  rec.onstart  = () => {
    setStatus("Listening", "thinking");
    micBtn.classList.add("recording");
    logActivity("Mic activated");
  };
  rec.onresult = (e) => {
    textInput.value = e.results[0][0].transcript;
    autoResize();
    setStatus("Input captured");
    micBtn.classList.remove("recording");
    logActivity("Voice captured");
  };
  rec.onerror  = () => {
    setStatus("Mic error", "error");
    micBtn.classList.remove("recording");
    logActivity("ERROR: Mic fault");
    setTimeout(() => setStatus("Ready"), 2000);
  };
  rec.onend = () => micBtn.classList.remove("recording");
  rec.start();
}

/* ── ENTER KEY  (original listener preserved) ──────── */
textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
});

/* ── AUTO RESIZE ────────────────────────────────── */
function autoResize() {
  textInput.style.height = "auto";
  textInput.style.height = Math.min(textInput.scrollHeight, 130) + "px";
}
textInput.addEventListener("input", autoResize);

/* ── CHIPS ──────────────────────────────────────── */
function useChip(text) {
  textInput.value = text;
  autoResize();
  textInput.focus();
  sendBtn.click();
}

/* ── PERSONALITY ────────────────────────────────── */
document.getElementById("personalityStack").addEventListener("click", (e) => {
  const btn = e.target.closest(".ps-btn");
  if (!btn) return;
  currentPersona = btn.dataset.persona;
  document.querySelectorAll(".ps-btn").forEach(b => b.classList.toggle("active", b === btn));
  setStatus("Mode: " + btn.dataset.persona.toUpperCase());
  logActivity("AI mode: " + btn.dataset.persona.toUpperCase());
  setTimeout(() => setStatus("Ready"), 2000);
});

/* ── AUTO SPEAK ─────────────────────────────────── */
document.getElementById("autoSpeakToggle").addEventListener("change", (e) => {
  autoSpeak = e.target.checked;
  logActivity("Auto-speak: " + (autoSpeak ? "ON" : "OFF"));
  setStatus("Auto-speak " + (autoSpeak ? "activated" : "deactivated"));
  setTimeout(() => setStatus("Ready"), 1500);
});

/* ── VOICE GENDER ───────────────────────────────── */
document.getElementById("voiceSelect").addEventListener("change", (e) => {
  preferredGender = e.target.value;
  logActivity("Voice: " + e.target.value.toUpperCase());
});

/* ── CLEAR CHAT ─────────────────────────────────── */
document.getElementById("clearChatBtn").addEventListener("click", () => {
  document.getElementById("clearModal").classList.add("active");
});
document.getElementById("cancelClear").addEventListener("click", () => {
  document.getElementById("clearModal").classList.remove("active");
});
document.getElementById("confirmClear").addEventListener("click", () => {
  chatBox.innerHTML = "";
  msgCount = 0;
  localStorage.removeItem("jarvix_chat_v1");
  showWelcome();
  document.getElementById("suggestionChips").style.display = "flex";
  document.getElementById("clearModal").classList.remove("active");
  setStatus("Memory purged");
  logActivity("Chat log cleared");
  setTimeout(() => setStatus("Ready"), 1500);
});

/* ── WELCOME SCREEN ─────────────────────────────── */
function showWelcome() {
  const div = document.createElement("div");
  div.className = "welcome";
  div.innerHTML = `
    <div class="welcome-hex">
      <svg viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27"
          stroke="url(#wg)" stroke-width="1.5" fill="rgba(255,34,68,0.06)"/>
        <polygon points="50,18 77,33 77,67 50,82 23,67 23,33"
          stroke="rgba(0,170,255,0.4)" stroke-width="1" fill="rgba(0,170,255,0.04)"/>
        <circle cx="50" cy="50" r="10"
          fill="rgba(255,34,68,0.2)" stroke="#ff2244" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="4" fill="#ff2244"/>
        <defs>
          <linearGradient id="wg" x1="10" y1="5" x2="90" y2="95">
            <stop stop-color="#ff2244"/><stop offset="1" stop-color="#00aaff"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <h2>JARVIX ONLINE</h2>
    <p>Neural command interface active.<br>All systems nominal. Awaiting operator input.</p>
  `;
  chatBox.appendChild(div);
}
/* ═══ NEW FEATURE EXTENSIONS (non-breaking) ═══ */

/* TOAST SYSTEM */
function showToast(msg, type = "info") {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

/* PROFILE NAME from sessionStorage */
(function loadProfileName() {
  const raw = sessionStorage.getItem("jarvix_user");
  if (!raw) return;
  const display = raw.includes("@") ? raw.split("@")[0] : raw;
  const el = document.getElementById("profileName");
  if (el) el.textContent = display.toUpperCase().slice(0, 12);
})();

/* CLOCK */
function initClock() {
  const el = document.getElementById("gaugeTime");
  if (!el) return;
  function tick() {
    el.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  }
  tick();
  setInterval(tick, 1000);
}

/* NEURAL FLICKER */
function initNeuralFlicker() {
  setInterval(() => {
    const val = Math.floor(30 + Math.random() * 62);
    const bar = document.getElementById("neuralBar");
    const pct = document.getElementById("neuralPct");
    if (bar) bar.style.width = val + "%";
    if (pct) pct.textContent = val + "%";
  }, 2200);
}

/* RADAR */
function initRadar() {
  const canvas = document.getElementById("radarCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const cx = 80, cy = 80, r = 72;
  let angle = 0, blips = [];
  setInterval(() => {
    if (blips.length < 6) blips.push({
      x: cx + (Math.random()-.5)*r*1.3,
      y: cy + (Math.random()-.5)*r*1.3,
      life:1, decay:.007+Math.random()*.006
    });
  }, 1300);
  function draw() {
    ctx.clearRect(0,0,160,160);
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle="rgba(3,6,20,0.88)"; ctx.fill();
    [r*.25,r*.5,r*.75,r].forEach(rad=>{
      ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2);
      ctx.strokeStyle="rgba(0,170,255,.1)"; ctx.lineWidth=1; ctx.stroke();
    });
    ctx.strokeStyle="rgba(0,170,255,.09)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle="rgba(0,170,255,.28)"; ctx.lineWidth=1.5; ctx.stroke();
    // sweep
    ctx.save();
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle-1.2,angle); ctx.closePath(); ctx.clip();
    const sg=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    sg.addColorStop(0,"rgba(255,34,68,0)");
    sg.addColorStop(.7,"rgba(255,34,68,.1)");
    sg.addColorStop(1,"rgba(255,34,68,.22)");
    ctx.fillStyle=sg; ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(r,0);
    ctx.strokeStyle="rgba(255,34,68,.85)"; ctx.lineWidth=1.5;
    ctx.shadowColor="#ff2244"; ctx.shadowBlur=7; ctx.stroke(); ctx.restore();
    angle+=.025;
    blips=blips.filter(b=>b.life>0);
    blips.forEach(b=>{
      const d=Math.hypot(b.x-cx,b.y-cy);
      if(d<=r){
        ctx.beginPath(); ctx.arc(b.x,b.y,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,255,150,${b.life})`; ctx.shadowColor="#00ff96"; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
      }
      b.life-=b.decay;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* HUD CANVAS (particles + energy lines) */
function initCanvas() {
  const canvas=document.getElementById("hudCanvas"); if(!canvas) return;
  const ctx=canvas.getContext("2d"); let W,H,particles=[],lines=[];
  function resize(){
    W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;
    particles=Array.from({length:55},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.3,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,col:Math.random()>.55?"255,34,68":"0,170,255",phase:Math.random()*Math.PI*2}));
    lines=Array.from({length:8},()=>({x1:Math.random()*W,y1:Math.random()*H,x2:Math.random()*W,y2:Math.random()*H,progress:Math.random(),speed:.002+Math.random()*.003,col:Math.random()>.5?"255,34,68":"0,170,255",alpha:.1+Math.random()*.08}));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    lines.forEach(l=>{
      l.progress+=l.speed; if(l.progress>1){l.progress=0;l.x1=Math.random()*W;l.y1=Math.random()*H;l.x2=Math.random()*W;l.y2=Math.random()*H;}
      const px=l.x1+(l.x2-l.x1)*l.progress,py=l.y1+(l.y2-l.y1)*l.progress;
      ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(px,py);ctx.strokeStyle=`rgba(${l.col},${l.alpha})`;ctx.lineWidth=.6;ctx.stroke();
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle=`rgba(${l.col},.55)`;ctx.fill();
    });
    particles.forEach((p,i)=>{
      p.phase+=.005; const a=.18+.18*Math.sin(p.phase);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.col},${a})`;ctx.fill();
      for(let j=i+1;j<particles.length;j++){const dx=p.x-particles[j].x,dy=p.y-particles[j].y,d=Math.hypot(dx,dy);if(d<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(${p.col},${.038*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke();}}
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize",resize); resize(); draw();
}

/* OVERRIDE logActivity to show toast for important events */
const _origLog = typeof logActivity === "function" ? logActivity : null;
function logActivity(text) {
  const log = document.getElementById("activityLog");
  if (!log) return;
  const item = document.createElement("div");
  item.className = "alog-item alog-new";
  item.textContent = "◈ " + text;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 14) log.removeChild(log.firstChild);
}

/* OVERRIDE setStatus to update arc */
function setStatus(text, type = "ready") {
  const arcMain = document.getElementById("arcMainText");
  const arcSub  = document.getElementById("statusText");
  if (arcSub) arcSub.textContent = text.toUpperCase();
  const col = { ready:"#00aaff", thinking:"#ff2244", speaking:"#ffd700", error:"#ff2244" };
  if (arcMain) {
    arcMain.style.color      = col[type] || col.ready;
    arcMain.style.textShadow = `0 0 12px ${col[type] || col.ready}`;
  }
}

/* OVERRIDE showThinking */
function showThinking(show) {
  const el = document.getElementById("thinkingRing");
  if (el) el.classList.toggle("active", show);
  if (show) setStatus("Processing", "thinking");
}

/* OVERRIDE showWave */
function showWave(show) {
  const el = document.getElementById("waveformOverlay");
  if (el) el.classList.toggle("active", show);
}

/* OVERRIDE addMessage to use HUD-style bubbles */
const _origAddMsg = typeof addMessage === "function" ? addMessage : null;
let _msgCount = 0;
function addMessage(msg, type) {
  const chips = document.getElementById("suggestionChips");
  const welcome = chatBox.querySelector(".welcome");
  if (chips) chips.style.display = "none";
  if (welcome) welcome.remove();
  _msgCount++;
  const isUser = type === "user";
  const row = document.createElement("div");
  row.className = `msg-row ${isUser ? "u-row" : "b-row"}`;
  const ts = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  row.innerHTML = `
    <div class="msg-meta">
      <div class="m-avatar">${isUser ? "USR" : "JVX"}</div>
      <span>${isUser ? "OPERATOR" : "JARVIX"}</span>
      <span>${ts}</span>
      <span>#${String(_msgCount).padStart(4,"0")}</span>
    </div>
    <div class="msg-wrap">
      <div class="bubble">${msg.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
      <button class="copy-btn" title="Copy" onclick="copyMsg(this)">⊕</button>
    </div>`;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  localStorage.setItem("jarvix_chat_v1", chatBox.innerHTML);
}

/* OVERRIDE addBotStreaming */
async function addBotStreaming(msg) {
  _msgCount++;
  const row = document.createElement("div");
  row.className = "msg-row b-row";
  const ts = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  row.innerHTML = `
    <div class="msg-meta">
      <div class="m-avatar">JVX</div>
      <span>JARVIX</span><span>${ts}</span><span>#${String(_msgCount).padStart(4,"0")}</span>
    </div>
    <div class="msg-wrap">
      <div class="bubble" id="streamBubble"></div>
      <button class="copy-btn" title="Copy" onclick="copyMsg(this)">⊕</button>
    </div>`;
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  const bubble = document.getElementById("streamBubble");
  const words = msg.split(" ");
  bubble.textContent = "";
  for (let i = 0; i < words.length; i++) {
    bubble.textContent += (i===0?"":' ') + words[i];
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(r => setTimeout(r, 23 + Math.random()*20));
  }
  bubble.removeAttribute("id");
  localStorage.setItem("jarvix_chat_v1", chatBox.innerHTML);
}

/* COPY */
function copyMsg(btn) {
  const text = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✓"; btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "⊕"; btn.classList.remove("copied"); }, 1800);
  });
}

/* OVERRIDE playNotif */
function playNotif() {
  try {
    const ac=new(window.AudioContext||window.webkitAudioContext)();
    [[880,.08],[660,.06],[440,.04]].forEach(([f,v],i)=>{
      const osc=ac.createOscillator(),g=ac.createGain();
      osc.connect(g);g.connect(ac.destination);osc.frequency.value=f;
      g.gain.setValueAtTime(v,ac.currentTime+i*.08);
      g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+i*.08+.15);
      osc.start(ac.currentTime+i*.08);osc.stop(ac.currentTime+i*.08+.18);
    });
  } catch(e){}
}

/* OVERRIDE showWelcome */
function showWelcome() {
  const div = document.createElement("div");
  div.className = "welcome";
  div.innerHTML = `
    <div class="welcome-hex">
      <svg viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" stroke="url(#wg)" stroke-width="1.5" fill="rgba(255,34,68,0.06)"/>
        <polygon points="50,18 77,33 77,67 50,82 23,67 23,33" stroke="rgba(0,170,255,0.4)" stroke-width="1" fill="rgba(0,170,255,0.04)"/>
        <circle cx="50" cy="50" r="10" fill="rgba(255,34,68,0.2)" stroke="#ff2244" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="4" fill="#ff2244"/>
        <defs><linearGradient id="wg" x1="10" y1="5" x2="90" y2="95"><stop stop-color="#ff2244"/><stop offset="1" stop-color="#00aaff"/></linearGradient></defs>
      </svg>
    </div>
    <h2>JARVIX ONLINE</h2>
    <p>Neural command interface active.<br>All systems nominal. Awaiting operator input.</p>`;
  chatBox.appendChild(div);
}

/* OVERRIDE initAll to call new systems */
function initAll() {
  loadVoices();
  initCanvas();
  initRadar();
  initClock();
  initNeuralFlicker();
  loadChat();
  setLang("en");
  logActivity("Interface activated");
  showToast("JARVIX ONLINE", "ok");
  loadTheme();
}

/* ═══ THEME SWITCHER ═══ */
function setTheme(name) {
  document.documentElement.dataset.theme = (name === "neon") ? "" : name;
  if (name === "neon") delete document.documentElement.dataset.theme;
  localStorage.setItem("jarvix_theme", name);
  document.querySelectorAll(".theme-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.t === name);
  });
  logActivity("Theme: " + name.toUpperCase());
  showToast("THEME: " + name.toUpperCase(), "info");
}

function loadTheme() {
  const saved = localStorage.getItem("jarvix_theme") || "neon";
  setTheme(saved);
}

/* ═══ ENHANCED SHOW THINKING — adds chat column glow ═══ */
const _baseShowThinking = showThinking;
function showThinking(show) {
  const el = document.getElementById("thinkingRing");
  const col = document.querySelector(".chat-column");
  if (el) el.classList.toggle("active", show);
  if (col) col.classList.toggle("thinking-active", show);
  if (show) setStatus("Processing", "thinking");
  else setStatus("Ready", "ready");
}
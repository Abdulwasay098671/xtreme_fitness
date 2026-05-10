/* ═══════════════════════════════════════
   XTREME FITNESS — main.js
   ═══════════════════════════════════════ */

/* ── THEME SYSTEM ── */
const THEMES = [
  { id: "dark", label: "Dark (Default)", color: "#39ff14" },
  { id: "light", label: "Light Mode", color: "#16a34a" },
  { id: "neon-blue", label: "Neon Blue", color: "#00d4ff" },
  { id: "neon-red", label: "Neon Red", color: "#ff2d55" },
];

let currentTheme = localStorage.getItem("xf-theme") || "dark";
let panelOpen = false;

function applyTheme(id) {
  document.documentElement.setAttribute("data-theme", id);
  currentTheme = id;
  localStorage.setItem("xf-theme", id);

  // Update active swatch
  document.querySelectorAll(".swatch-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === id);
  });

  // Update toggle button label
  const theme = THEMES.find((t) => t.id === id);
  const labelEl = document.getElementById("themeLabel");
  if (labelEl && theme) labelEl.textContent = theme.label;

  // Light/dark toggle icon
  const iconEl = document.getElementById("toggleIcon");
  if (iconEl) {
    iconEl.textContent = id === "light" ? "☀️" : "🌙";
  }
}

function toggleDarkLight() {
  const next = currentTheme === "light" ? "dark" : "light";
  applyTheme(next);
}

function toggleColorPanel() {
  panelOpen = !panelOpen;
  const panel = document.getElementById("colorPanel");
  if (panel) panel.classList.toggle("open", panelOpen);
}

function closeColorPanel() {
  panelOpen = false;
  const panel = document.getElementById("colorPanel");
  if (panel) panel.classList.remove("open");
}

// Build the theme controls HTML dynamically
function initThemeControls() {
  const container = document.getElementById("themeControls");
  if (!container) return;

  const swatchHTML = THEMES.map(
    (t) => `
    <button class="swatch-btn${t.id === currentTheme ? " active" : ""}"
            data-theme="${t.id}"
            onclick="applyTheme('${t.id}'); closeColorPanel();">
      <span class="swatch-dot" style="background:${t.color}"></span>
      ${t.label}
    </button>
  `,
  ).join("");

  container.innerHTML = `
    <div class="color-panel" id="colorPanel">
      <div class="color-panel-title">Color Theme</div>
      ${swatchHTML}
    </div>
    <div style="display:flex;gap:8px;">
      <!-- Dark/Light toggle -->
      <button class="theme-toggle-btn" onclick="toggleDarkLight()" title="Toggle Dark/Light">
        <span class="toggle-icon" id="toggleIcon">🌙</span>
        <span id="themeLabel">Dark</span>
      </button>
      <!-- Color picker toggle -->
      <button class="theme-toggle-btn" onclick="toggleColorPanel()" title="Change Color Theme" style="padding:10px 14px;">
        🎨
      </button>
    </div>
  `;

  // Close panel on outside click
  document.addEventListener("click", (e) => {
    if (
      panelOpen &&
      !e.target.closest("#colorPanel") &&
      !e.target.closest('[onclick="toggleColorPanel()"]')
    ) {
      closeColorPanel();
    }
  });
}

/* ── CUSTOM CURSOR ── */
function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!cursor || !ring) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    setTimeout(() => {
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    }, 80);
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      ring.style.width = "50px";
      ring.style.height = "50px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "14px";
      cursor.style.height = "14px";
      ring.style.width = "36px";
      ring.style.height = "36px";
    });
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = i * 0.08 + "s";
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
  );
  reveals.forEach((r) => observer.observe(r));
}

/* ── ACTIVE NAV LINK ── */
function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === "#" + current) a.classList.add("active");
      });
    },
    { passive: true },
  );
}

/* ── HAMBURGER MENU ── */
function toggleMenu() {
  const ham = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  if (!ham || !nav) return;
  ham.classList.toggle("open");
  nav.classList.toggle("open");
  document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
}

function closeMenu() {
  const ham = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  if (!ham || !nav) return;
  ham.classList.remove("open");
  nav.classList.remove("open");
  document.body.style.overflow = "";
}

function initMobileMenu() {
  document.addEventListener("click", (e) => {
    const nav = document.getElementById("mobileNav");
    const ham = document.getElementById("hamburger");
    if (
      nav &&
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      ham &&
      !ham.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/* ── FORM SUBMIT ── */
function submitForm() {
  const fname = document.getElementById("fname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;

  let valid = true;
  ["fname", "phone", "plan"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.style.borderColor = "#ff3333";
      el.style.boxShadow = "0 0 0 1px rgba(255,50,50,0.2)";
      valid = false;
      el.addEventListener(
        "input",
        () => {
          el.style.borderColor = "";
          el.style.boxShadow = "";
        },
        { once: true },
      );
    }
  });

  if (!valid) {
    showErrorAlert("Zaroori fields fill karo — Name, Phone aur Plan.");
    return;
  }

  const btn = document.querySelector(".form-submit");
  if (btn) {
    btn.textContent = "PROCESSING...";
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";
    btn.disabled = true;
  }

  setTimeout(() => {
    const planLabels = {
      starter: "Starter — Rs 3,500/month",
      pro: "Pro — Rs 6,500/month",
      elite: "Elite — Rs 12,000/month",
      annual: "Annual — Rs 55,000/year",
    };
    showSuccessModal(fname || "Member", planLabels[plan] || plan, phone);
  }, 1800);
}

/* ── SUCCESS MODAL ── */
function showSuccessModal(name, plan, phone) {
  const modal = document.createElement("div");
  modal.id = "xf-modal";
  modal.innerHTML = `
    <div class="xf-backdrop"></div>
    <div class="xf-box">
      <div class="xf-icon">
        <svg viewBox="0 0 60 60" width="60" height="60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="var(--neon)" stroke-width="2" class="xf-circle"/>
          <polyline points="16,30 26,40 44,20" fill="none" stroke="var(--neon)" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round" class="xf-check"/>
        </svg>
      </div>
      <div class="xf-title">APPLICATION SUBMITTED!</div>
      <div class="xf-sub">Shukriya, <span>${name}</span>! Tumhari application receive ho gayi.</div>
      <div class="xf-details">
        <div class="xf-detail-row"><span>Plan</span><span>${plan}</span></div>
        <div class="xf-detail-row"><span>Contact</span><span>${phone}</span></div>
        <div class="xf-detail-row"><span>Status</span><span class="xf-status">PENDING REVIEW</span></div>
      </div>
      <div class="xf-msg">Hamare team se <strong>24 ghante</strong> ke andar tumhe call aayegi. Gym visit ke liye ready raho! 💪</div>
      <button class="xf-close-btn" onclick="closeModal()">DONE — LET'S GO!</button>
      <div class="xf-ref">Ref: #XF-${Date.now().toString().slice(-6)}</div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => modal.classList.add("xf-visible"));

  modal.querySelector(".xf-backdrop").addEventListener("click", closeModal);
}

function closeModal() {
  const modal = document.getElementById("xf-modal");
  if (!modal) return;
  modal.classList.remove("xf-visible");
  document.body.style.overflow = "";
  setTimeout(() => modal.remove(), 400);

  document
    .querySelector(".admission-form")
    ?.querySelectorAll("input, select, textarea")
    .forEach((el) => (el.value = ""));

  const btn = document.querySelector(".form-submit");
  if (btn) {
    btn.textContent = "SUBMIT APPLICATION →";
    btn.style.opacity = "";
    btn.style.cursor = "";
    btn.disabled = false;
  }
}

/* ── ERROR ALERT ── */
function showErrorAlert(msg) {
  const existing = document.getElementById("xf-err");
  if (existing) existing.remove();

  const err = document.createElement("div");
  err.id = "xf-err";
  err.innerHTML = `<span>⚠ ${msg}</span><button onclick="this.parentElement.remove()">✕</button>`;
  document.querySelector(".admission-form")?.prepend(err);
  setTimeout(() => err.remove(), 4000);
}

/* ── BOOT ── */
document.addEventListener("DOMContentLoaded", () => {
  initThemeControls();
  applyTheme(currentTheme); // Restore saved theme
  initCursor();
  initScrollReveal();
  initNavHighlight();
  initMobileMenu();
});

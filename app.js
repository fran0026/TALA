const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const yearEl = document.getElementById("year");
const siteHeader = document.getElementById("siteHeader");
const discoverToggle = document.getElementById("discoverToggle");
const discoverDropdown = document.getElementById("discoverDropdown");
const discoverScrim = document.getElementById("discoverScrim");
const discoverPanel = document.getElementById("discoverPanel");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

function setDiscoverOpen(open) {
  if (!siteHeader || !discoverToggle) return;
  siteHeader.classList.toggle("discover-open", open);
  discoverToggle.setAttribute("aria-expanded", open ? "true" : "false");
  if (discoverDropdown) {
    discoverDropdown.setAttribute("aria-hidden", open ? "false" : "true");
  }
  if (discoverScrim) {
    if (open) {
      discoverScrim.removeAttribute("hidden");
    } else {
      discoverScrim.setAttribute("hidden", "");
    }
    discoverScrim.classList.toggle("is-visible", open);
    discoverScrim.setAttribute("aria-hidden", open ? "false" : "true");
  }
}

function syncDiscoverActive() {
  if (!discoverPanel) return;
  const raw = location.pathname.split("/").filter(Boolean);
  const file = raw.length ? raw[raw.length - 1].toLowerCase() : "";
  const isHome = !file || file === "index.html";
  discoverPanel.querySelectorAll(".rail-card").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    a.classList.toggle("is-active", Boolean(!isHome && href === file));
  });
}

syncDiscoverActive();

if (discoverToggle && siteHeader) {
  discoverToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !siteHeader.classList.contains("discover-open");
    setDiscoverOpen(open);
    if (open && mainNav && menuBtn && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

discoverScrim?.addEventListener("click", () => setDiscoverOpen(false));

discoverPanel?.querySelectorAll("a.rail-card").forEach((a) => {
  a.addEventListener("click", () => setDiscoverOpen(false));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setDiscoverOpen(false);
});

/** Readable tagline; grow `.brand-title` until it spans at least the tagline width. */
function fitBrandBlock() {
  const title = document.querySelector(".brand-title");
  const line = document.querySelector(".brand-line");
  const lock = document.querySelector(".brand-lock");
  if (!title || !line || !lock) return;

  title.style.removeProperty("font-size");
  line.style.removeProperty("font-size");
  lock.style.removeProperty("width");

  void lock.offsetWidth;

  const taglineW = Math.ceil(line.scrollWidth);
  if (taglineW < 24) return;

  const titleW = () => title.getBoundingClientRect().width;

  if (titleW() >= taglineW - 0.5) {
    lock.style.width = `${Math.ceil(Math.max(titleW(), taglineW))}px`;
    return;
  }

  const basePx = parseFloat(getComputedStyle(title).fontSize) || 16;
  let lo = basePx;
  let hi = basePx;
  title.style.fontSize = `${hi}px`;
  while (titleW() < taglineW && hi < 88) {
    hi += 1;
    title.style.fontSize = `${hi}px`;
  }

  if (titleW() < taglineW) {
    lock.style.width = `${taglineW}px`;
    return;
  }

  lo = basePx;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    title.style.fontSize = `${mid}px`;
    if (titleW() >= taglineW - 0.5) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  title.style.fontSize = `${hi}px`;
  lock.style.width = `${Math.ceil(Math.max(titleW(), taglineW))}px`;
}

function scheduleFitBrandBlock() {
  requestAnimationFrame(() => {
    fitBrandBlock();
  });
}

scheduleFitBrandBlock();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(scheduleFitBrandBlock);
} else {
  window.addEventListener("load", scheduleFitBrandBlock, { once: true });
}

let brandBlockResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(brandBlockResizeTimer);
  brandBlockResizeTimer = setTimeout(() => {
    scheduleFitBrandBlock();
    syncDiscoverActive();
  }, 120);
});

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    if (siteHeader && siteHeader.classList.contains("discover-open")) {
      setDiscoverOpen(false);
    }
    const open = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
        } else {
          entry.target.classList.remove("in");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );

  document.querySelectorAll(".main-inner .reveal").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".main-inner .reveal").forEach((el) => el.classList.add("in"));
}

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

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
  brandBlockResizeTimer = setTimeout(scheduleFitBrandBlock, 120);
});

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
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

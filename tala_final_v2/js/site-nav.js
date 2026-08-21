(() => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('discoverToggle');
  const dropdown = document.getElementById('discoverDropdown');
  const scrim = document.getElementById('discoverScrim');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.querySelector('.main-nav');

  const closeDiscover = () => {
    header?.classList.remove('discover-open');
    toggle?.setAttribute('aria-expanded', 'false');
    dropdown?.setAttribute('aria-hidden', 'true');
    if (scrim) { scrim.hidden = true; scrim.classList.remove('is-visible'); }
  };
  const openDiscover = () => {
    if (!header || !toggle || !dropdown) return;
    header.classList.add('discover-open');
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
    if (scrim) { scrim.hidden = false; scrim.classList.add('is-visible'); }
    nav?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    header?.classList.contains('discover-open') ? closeDiscover() : openDiscover();
  });
  scrim?.addEventListener('click', closeDiscover);
  dropdown?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDiscover));
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target)) closeDiscover();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDiscover(); });
  window.addEventListener('pageshow', closeDiscover);
})();

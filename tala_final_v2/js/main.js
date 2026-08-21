(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  document.addEventListener('pointerdown', (e) => {
    const touched = document.elementFromPoint(e.clientX, e.clientY);

    console.log('TOUCHED:', touched);
    console.log('MENU:', menu);
    console.log('MENU CONTAINS TOUCH:', menu?.contains(touched));
  });
  const intro = document.querySelector('.intro');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menu?.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  if (intro) {
    const key = 'tala-intro-seen-v3';
    const shouldPlay = !reduceMotion && !sessionStorage.getItem(key);
    if (!shouldPlay) {
      intro.classList.add('done');
    } else {
      body.classList.add('is-locked');
      sessionStorage.setItem(key, '1');
      window.setTimeout(() => {
        intro.classList.add('done');
        body.classList.remove('is-locked');
      }, 2800);
      intro.addEventListener('click', () => {
        intro.classList.add('done');
        body.classList.remove('is-locked');
      }, { once: true });
    }
  }

  /* Keep the hero stable by reserving the height of the longest phrase. */
  const typing = document.querySelector('.typing-text[data-typing]');
  if (typing) {
    const phrases = (typing.dataset.typing || '')
      .split('|')
      .map(text => text.trim())
      .filter(Boolean);

    const measureTypingHeight = () => {
      if (!phrases.length) return;
      const heading = typing.closest('.typing-heading');
      if (!heading) return;
      const probe = document.createElement('span');
      const cs = getComputedStyle(typing);
      Object.assign(probe.style, {
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        left: '-99999px',
        top: '0',
        width: `${Math.max(260, heading.clientWidth)}px`,
        font: cs.font,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        lineHeight: cs.lineHeight,
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
      });
      document.body.appendChild(probe);
      let maxHeight = 0;
      phrases.forEach(text => {
        probe.textContent = text;
        maxHeight = Math.max(maxHeight, probe.getBoundingClientRect().height);
      });
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.04;
      heading.style.setProperty('--typing-block-height', `${Math.max(maxHeight, lineHeight * 1.05)}px`);
      probe.remove();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(measureTypingHeight);
    } else {
      window.setTimeout(measureTypingHeight, 120);
    }
    window.addEventListener('resize', measureTypingHeight, { passive: true });

    if (reduceMotion) {
      typing.textContent = phrases[0] || '';
    } else if (phrases.length) {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;
      const TYPE_MS = 68;
      const DELETE_MS = 38;
      const HOLD_MS = 1600;
      const GAP_MS = 420;

      const tick = () => {
        const phrase = phrases[phraseIndex];
        if (!deleting) {
          charIndex += 1;
          typing.textContent = phrase.slice(0, charIndex);
          if (charIndex >= phrase.length) {
            deleting = true;
            window.setTimeout(tick, HOLD_MS);
            return;
          }
          window.setTimeout(tick, TYPE_MS);
          return;
        }
        charIndex -= 1;
        typing.textContent = phrase.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(tick, GAP_MS);
          return;
        }
        window.setTimeout(tick, DELETE_MS);
      };
      tick();
    }
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* Shared footer slogan across the new site shell. */
  document.querySelectorAll('.footer-brand .brand-tag').forEach(el => {
    el.textContent = 'Lighting the Future of Technology';
  });
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();

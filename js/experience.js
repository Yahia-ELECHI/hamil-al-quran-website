// Effets progressifs de l'accueil : le scroll natif et le contenu restent intacts.
(() => {
  if (!document.body.classList.contains('motion-home')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const band = document.querySelector('.band');
  const steps = [...document.querySelectorAll('.journey-step')];
  const screens = [...document.querySelectorAll('.journey-screen')];
  const indicators = [...document.querySelectorAll('.journey-indicators span')];
  const device = document.querySelector('.journey-device');
  let frame = 0, active = -1;
  const clamp = value => Math.max(0, Math.min(1, value));
  const motionAllowed = () => !reduced.matches && !root.classList.contains('motion-paused');

  function update() {
    frame = 0;
    const viewport = innerHeight;
    const scrollRange = root.scrollHeight - viewport;
    root.style.setProperty('--read-progress', scrollRange > 0 ? clamp(scrollY / scrollRange) : 0);
    if (motionAllowed()) {
      root.style.setProperty('--hero-progress', clamp(-hero.getBoundingClientRect().top / hero.offsetHeight));
      if (band) root.style.setProperty('--band-progress', clamp((viewport - band.getBoundingClientRect().top) / (viewport + band.offsetHeight)));
    } else {
      root.style.setProperty('--hero-progress', 0);
      root.style.setProperty('--band-progress', 0);
    }
    if (innerWidth <= 600) return;
    let closest = 0, distance = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const next = Math.abs(rect.top + rect.height / 2 - viewport / 2);
      if (next < distance) { distance = next; closest = index; }
    });
    if (closest === active) return;
    active = closest;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === active));
    screens.forEach((screen, i) => screen.classList.toggle('is-active', i === active));
    indicators.forEach((indicator, i) => indicator.classList.toggle('is-active', i === active));
    if (device) {
      device.dataset.chapter = String(active);
      dispatchEvent(new CustomEvent('hq:devicechapter', { detail: { chapter: active } }));
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('hq:languagechange', schedule);
  addEventListener('hq:motionchange', () => { active = -1; schedule(); });
  reduced.addEventListener('change', () => { active = -1; schedule(); });
  if (document.fonts) document.fonts.ready.then(schedule);
  update();

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.card').forEach(card => {
    let pointerFrame = 0, pointX = 0, pointY = 0;
    card.addEventListener('pointermove', event => {
      if (!fine.matches || !motionAllowed()) return;
      const bounds = card.getBoundingClientRect();
      pointX = event.clientX - bounds.left;
      pointY = event.clientY - bounds.top;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        card.style.setProperty('--pointer-x', `${pointX}px`);
        card.style.setProperty('--pointer-y', `${pointY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });
  });
})();

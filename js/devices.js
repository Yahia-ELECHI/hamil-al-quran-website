// Un seul moteur pour les appareils : perspective, inertie et mise en scène au scroll.
// Le PNG et les captures ne sont jamais retouchés. Aucun événement tactile n'est capturé.
(() => {
  const stages = [...document.querySelectorAll('[data-device]')];
  if (!stages.length) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const models = stages.map((stage, index) => ({
    stage, model:stage.querySelector('.device-model'), role:stage.dataset.device, index,
    visible:false, bounds:null, hovered:false, pointerX:0, pointerY:0,
    pose:[0,0,0,0,0,0], velocity:[0,0,0,0,0,0], ready:false, kick:0
  })).filter(item => item.model);
  let raf = 0, lastTime = 0, clock = 0, layoutDirty = true, pageAway = false;
  const allowed = () => !reduced.matches && !root.classList.contains('motion-paused');
  const runnable = () => allowed() && !document.hidden && !pageAway;

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
  }
  function schedule() {
    if (!raf && runnable()) raf = requestAnimationFrame(update);
  }
  function invalidate() { layoutDirty = true; schedule(); }
  function measure() {
    // Toutes les lectures de layout précèdent les écritures de la frame.
    models.forEach(item => {
      const rect = item.stage.getBoundingClientRect();
      item.bounds = rect;
      item.visible = rect.width > 0 && rect.height > 0 && rect.bottom > -60
        && rect.top < innerHeight + 60 && rect.right > 0 && rect.left < innerWidth;
    });
    layoutDirty = false;
  }
  function targetPose(item) {
    const rect = item.bounds;
    const progress = clamp((innerHeight / 2 - rect.top - rect.height / 2) / innerHeight, -.8, .8);
    const power = fine.matches ? 1 : .55;
    const wave = Math.sin(clock * .65 + item.index * 1.37);
    let x = 0, y = 0, rx = 1.5, ry = -5, rz = 2;
    switch (item.role) {
      case 'journey': {
        const chapter = clamp(Number(item.stage.dataset.chapter) || 0, 0, 2);
        ry = [-7, 6, -3][chapter]; rz = [2.5, -2.5, 1.5][chapter];
        y = wave * 4 - progress * 10;
        break;
      }
      case 'school-left':
        x = -progress * 14; y = 14 + wave * 4 - progress * 24;
        ry = -7 + progress * 7; rz = -7 + progress * 3;
        break;
      case 'school-right':
        x = progress * 14; y = -24 + wave * 5 + progress * 18;
        rx = -1; ry = 7 - progress * 6; rz = 6 - progress * 3;
        break;
      case 'gallery': {
        const across = clamp((rect.left + rect.width / 2 - innerWidth / 2) / innerWidth, -.6, .6);
        x = 0; y = (item.index % 2 ? 12 : 0) + wave * 2 - progress * 7;
        rx = 0; ry = across * -7; rz = (item.index % 2 ? 2 : -2) + across * 2;
        break;
      }
      default:
        y = wave * 6 - progress * 20; rx = 2 + progress * 3;
        ry = -5 + progress * 8; rz = 2 - progress * 2;
    }
    const px = item.hovered ? item.pointerX : 0;
    const py = item.hovered ? item.pointerY : 0;
    return [
      x * power + px * 4, y * power + py * 3,
      rx * power - py * 5, ry * power + px * 9 + item.kick * 2,
      rz * power + px * .8 + item.kick * .45, px
    ];
  }
  function paint(item) {
    const [x,y,rx,ry,rz,light] = item.pose;
    const style = item.model.style;
    style.setProperty('--device-x', `${x.toFixed(3)}px`);
    style.setProperty('--device-y', `${y.toFixed(3)}px`);
    style.setProperty('--device-rx', `${rx.toFixed(3)}deg`);
    style.setProperty('--device-ry', `${ry.toFixed(3)}deg`);
    style.setProperty('--device-rz', `${rz.toFixed(3)}deg`);
    style.setProperty('--device-shine', `${(-35 + light * 35).toFixed(2)}%`);
    style.setProperty('--device-light', (.10 + Math.abs(light) * .11).toFixed(3));
  }
  function update(now) {
    raf = 0;
    if (!runnable()) { lastTime = 0; return; }
    const dt = lastTime ? clamp((now - lastTime) / 1000, .001, 1 / 30) : 1 / 60;
    lastTime = now;
    clock += dt;
    if (layoutDirty) measure();
    let visible = false;
    models.forEach(item => {
      item.stage.classList.toggle('is-device-visible', item.visible);
      if (!item.visible) { item.hovered = false; item.ready = false; return; }
      visible = true;
      item.kick *= Math.exp(-dt * 5);
      const target = targetPose(item);
      if (!item.ready) {
        item.pose = target.slice(); item.velocity.fill(0); item.ready = true;
      } else {
        // Ressort amorti, borné par le delta temps : même inertie à 60 et 120 Hz.
        for (let i = 0; i < target.length; i++) {
          item.velocity[i] += (target[i] - item.pose[i]) * 85 * dt;
          item.velocity[i] *= Math.exp(-14 * dt);
          item.pose[i] += item.velocity[i] * dt;
        }
      }
      paint(item);
    });
    if (visible) schedule();
    else lastTime = 0;
  }
  models.forEach(item => {
    item.stage.addEventListener('pointermove', event => {
      if (!fine.matches || event.pointerType === 'touch' || !runnable() || !item.bounds) return;
      const rect = item.bounds;
      item.hovered = true;
      item.pointerX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      item.pointerY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      schedule();
    }, {passive:true});
    const leave = () => { item.hovered = false; schedule(); };
    item.stage.addEventListener('pointerleave', leave, {passive:true});
    item.stage.addEventListener('pointercancel', leave, {passive:true});
    item.stage.querySelectorAll('img').forEach(img => img.addEventListener('load', invalidate, {once:true}));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(() => invalidate(), {rootMargin:'60px', threshold:[0,.1,1]});
    models.forEach(item => observer.observe(item.stage));
  }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(invalidate);
    observer.observe(document.body);
  }
  function resetPointers() {
    models.forEach(item => { item.hovered = false; item.pointerX = 0; item.pointerY = 0; });
  }
  function syncMotion() {
    stop();
    resetPointers();
    invalidate();
  }
  addEventListener('scroll', invalidate, {passive:true,capture:true});
  addEventListener('resize', invalidate, {passive:true});
  addEventListener('hq:languagechange', invalidate);
  addEventListener('hq:motionchange', syncMotion);
  addEventListener('hq:devicechapter', invalidate);
  addEventListener('hq:deviceslide', event => {
    if (!runnable()) return;
    const item = models.find(entry => entry.role === 'preview');
    if (item && item.visible) { item.kick = clamp(Number(event.detail?.direction) || 1, -1, 1); schedule(); }
  });
  document.addEventListener('visibilitychange', () => { stop(); resetPointers(); invalidate(); });
  addEventListener('pagehide', () => { pageAway = true; stop(); resetPointers(); });
  addEventListener('pageshow', () => { pageAway = false; invalidate(); });
  reduced.addEventListener('change', syncMotion);
  fine.addEventListener('change', syncMotion);
  if (document.fonts) document.fonts.ready.then(invalidate);
  schedule();
})();

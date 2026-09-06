/* Galaxie procédurale : WebGL natif, sans CDN ni texture téléchargée.
 * Flux sur cinq chemins, momentum individuel ; lumière et bloom sur le GPU.
 * Le décor n'est jamais nécessaire à la navigation ou à la lecture.
 */
(Math => {
  'use strict';
  function init() {
    const canvas = document.getElementById('ambient-canvas');
    const hero = document.getElementById('home');
    const surface = document.getElementById('galaxy-interaction');
    if (!canvas) return;
    const hasHero = Boolean(hero && surface);
    const root = document.documentElement;
    const stage = canvas.parentElement;
    const sceneWindow = surface ? surface.parentElement : null;
    const hint = document.getElementById('galaxy-hint');
    const replay = document.getElementById('galaxy-replay');
    const motion = document.getElementById('motion-toggle');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
    const TAU = Math.PI * 2;
    let reduced = media.matches;
    let paused = root.classList.contains('motion-paused');
    try { paused = paused || sessionStorage.getItem('hq-motion-paused') === 'true'; } catch (_) { /* Stockage facultatif. */ }
    let pageActive = true, lost = false, available = false;
    let gl = null, program = null, buffer = null, uniforms = {}, vertices = null;
    let motionBuffer = null, motionAttributes = [], positions = null, momentum = null;
    let simulatedTime = 0, coastRemaining = 0, scrollCooldown = 0;
    let cursor = null, previousCursor = null, returning = false;
    const layerYaw = new Float32Array(5), layerPitch = new Float32Array(5);
    const paths = [];
    const pathSpeeds = [.020, .0144, .0168, .0128, .024];
    let post = null, targets = [], targetWidth = 0, targetHeight = 0;
    let targetType = null;
    let attributes = [];
    let vertexCount = 0, quality = '', maxPoint = 64;
    let width = 1, height = 1, dpr = 1, mobile = false, rtl = false;
    let anchorX = 0, anchorY = 0, scale = 1, scrollProgress = 0;
    let frame = 0, lastTime = 0, dirty = true, needsMeasure = true, time = 0;
    let lastDraw = 0;
    try { time = clamp(Number(sessionStorage.getItem('hq-cosmos-time')) || 0, 0, 100000); } catch (_) { /* Continuité facultative. */ }
    let intro = !hasHero || reduced || paused || time > 0 ? 1 : 0;
    let hoverX = 0, hoverY = 0, pointerX = 0, pointerY = 0;
    let targetYaw = 0, targetPitch = 0, yaw = 0, pitch = 0;
    let velocityYaw = 0, velocityPitch = 0, drag = null;
    let surfaceRect = { left: 0, top: 0, width: 1, height: 1 };
    // Un seul nuage traverse ces compositions ; aucun système n'est redémarré au scroll.
    const profiles = {
      home:       { x:.76, y:.5, ribbon:0, orbit:0, light:.5, spread:1, clearX:.27, clearWidth:.24 },
      journey:    { x:.85, y:.5, ribbon:.45, orbit:.7, light:.72, spread:.78, clearX:.26, clearWidth:.25 },
      features:   { x:.5, y:.5, ribbon:1, orbit:0, light:.62, spread:1.15, clearX:.5, clearWidth:.31 },
      school:     { x:.88, y:.52, ribbon:.15, orbit:1, light:.62, spread:.85, clearX:.3, clearWidth:.28 },
      tools:      { x:.5, y:.4, ribbon:.85, orbit:.1, light:.54, spread:1.2, clearX:.5, clearWidth:.32 },
      tutorials:  { x:.5, y:.5, ribbon:0, orbit:0, light:.3, spread:1, clearX:.5, clearWidth:.37 },
      preview:    { x:.83, y:.5, ribbon:.1, orbit:1, light:.68, spread:.8, clearX:.26, clearWidth:.26 },
      quote:      { x:.5, y:.5, ribbon:.7, orbit:.1, light:.35, spread:1.2, clearX:.5, clearWidth:.4 },
      download:   { x:.5, y:.5, ribbon:0, orbit:1, light:.72, spread:1.55, clearX:.5, clearWidth:.25 },
      reading:    { x:.5, y:.5, ribbon:.25, orbit:0, light:.4, spread:1, clearX:.5, clearWidth:.33 },
      about:      { x:.5, y:.5, ribbon:.65, orbit:.3, light:.58, spread:1.3, clearX:.5, clearWidth:.32 },
      contact:    { x:.5, y:.5, ribbon:.2, orbit:.6, light:.32, spread:1.5, clearX:.5, clearWidth:.38 },
      footer:     { x:.5, y:.5, ribbon:.8, orbit:0, light:.32, spread:1.1, clearX:.5, clearWidth:.39 }
    };
    const chapters = Array.from(document.querySelectorAll('[data-cosmos]'));
    let scene = { ...profiles[hasHero ? 'home' : 'reading'] };
    let travel = 0;

    const vertexShader = `
      precision highp float;
      attribute vec4 aOrbit;
      attribute vec3 aStyle;
      attribute vec3 aColor;
      attribute vec3 aScatter;
      attribute vec4 aScreen;
      attribute float aEnergy;
      uniform vec2 uViewport, uCamera, uPointer;
      uniform vec4 uScene;
      uniform vec2 uReading;
      uniform float uTime, uIntro, uScroll, uDpr, uPointMax, uMobile, uRtl, uHover;
      varying mediump vec3 vColor;
      varying mediump float vAlpha, vKind, vSize, vDiameter, vRay;
      void main() {
        float seed = aOrbit.w;
        float kind = aStyle.z;
        float bg = step(1.5, kind) * (1.0 - step(2.5, kind));
        vec2 pixel = aScreen.xy;
        float disperse = uScroll;
        float size = aStyle.x * aScreen.z * mix(1.0, 0.76, disperse * (1.0 - bg));
        float side = mix(pixel.x, uViewport.x - pixel.x, uRtl) / uViewport.x;
        float heroMask = mix(smoothstep(0.39, 0.49, side), 1.0, uMobile);
        float clearDistance = abs(pixel.x / uViewport.x - uReading.x);
        float readingMask = mix(0.055, 1.0, smoothstep(uReading.y, uReading.y + 0.13, clearDistance));
        float mask = mix(heroMask, readingMask * uScene.z, disperse);
        float twinkle = 0.87 + 0.13 * sin(uTime * (0.8 + seed * 0.9) + seed * 127.0);
        float dustFade = kind > 0.5 && kind < 1.5 ? 1.0 - disperse * 0.8 : 1.0;
        if (kind > 2.5) dustFade = 1.0 - disperse;
        float cursorLight = exp(-pow(length(pixel - (uPointer * 0.5 + 0.5) * uViewport) / 120.0, 2.0)) * uHover;
        vColor = aColor * (1.0 + aEnergy * 0.32 + cursorLight * 0.12);
        vAlpha = aStyle.y * mask * twinkle * dustFade * smoothstep(0.0, 0.24, uIntro);
        vAlpha *= aScreen.w;
        vAlpha *= mix(1.0, mix(0.72, 0.4, bg), uMobile);
        vAlpha *= mix(1.0, 0.72, disperse * (1.0 - bg));
        vKind = kind;
        vDiameter = size;
        vRay = aScatter.z * 1.4 + uCamera.y * 0.3;
        gl_PointSize = clamp(max(4.0, size * 3.2) * uDpr, 1.0, uPointMax);
        vSize = gl_PointSize / uDpr;
        gl_Position = vec4(pixel / uViewport * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
      }
    `;
    const fragmentShader = `
      precision mediump float;
      varying mediump vec3 vColor;
      varying mediump float vAlpha, vKind, vSize, vDiameter, vRay;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float rr = dot(p, p);
        if (rr > 1.0) discard;
        float edge = 1.0 - smoothstep(0.7, 1.0, rr);
        // Empreinte minimale de 4px : conserve l'énergie des étoiles sous-pixel.
        vec2 px = p * vSize * 0.5;
        float sigma = max(0.48, vDiameter * 0.36);
        float core = exp(-dot(px, px) / (2.0 * sigma * sigma));
        float energy = min(1.0, vDiameter * vDiameter);
        float bright = smoothstep(2.5, 6.0, vDiameter);
        float halo = exp(-rr * 5.0) * 0.08 * bright;
        vec2 ray = mat2(cos(vRay), -sin(vRay), sin(vRay), cos(vRay)) * px;
        float rays = (exp(-abs(ray.x) * 4.0) + exp(-abs(ray.y) * 4.0)) * exp(-length(px) * 0.35) * bright * 0.12;
        float light = (core + halo + rays) * energy;
        if (vKind > 0.5 && vKind < 1.5) light = exp(-rr * 5.0) * 0.04;
        if (vKind > 2.5 && vKind < 3.5) light = exp(-rr * 5.0) * 0.5;
        vec3 color = mix(vColor, vec3(1.0, 0.99, 0.97), core * bright * 0.68);
        gl_FragColor = vec4(color, light * vAlpha * edge);
      }
    `;

    const screenVertex = `
      attribute vec2 aPosition;
      varying mediump vec2 vUv;
      void main() { vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition, 0.0, 1.0); }
    `;
    const screenFragment = `
      precision mediump float;
      varying mediump vec2 vUv;
      uniform sampler2D uScene, uBloom, uWide;
      uniform vec2 uDirection;
      uniform float uPass;
      void main() {
        vec3 c = texture2D(uScene, vUv).rgb;
        if (uPass < 0.5) {
          // Extraction douce, sans faire rayonner le noir ni les étoiles lointaines.
          float peak = max(c.r, max(c.g, c.b));
          c *= smoothstep(0.08, 0.26, peak);
        } else if (uPass < 1.5) {
          c *= 0.227027;
          c += texture2D(uScene, vUv + uDirection * 1.384615).rgb * 0.316216;
          c += texture2D(uScene, vUv - uDirection * 1.384615).rgb * 0.316216;
          c += texture2D(uScene, vUv + uDirection * 3.230769).rgb * 0.070270;
          c += texture2D(uScene, vUv - uDirection * 3.230769).rgb * 0.070270;
        } else {
          c += texture2D(uBloom, vUv).rgb * 0.7;
          c += texture2D(uWide, vUv).rgb * 0.8;
          // Courbe filmique après bloom ; les cibles HDR préservent les hautes lumières.
          c *= 1.05;
          c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
          c = pow(max(c, vec3(0.0)), vec3(0.82));
          c += vec3(0.014, 0.023, 0.032);
        }
        gl_FragColor = vec4(c, 1.0);
      }
    `;

    function buildGeometry(compact) {
      let seed = 84173;
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
      const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(0.00001, random()))) * Math.cos(TAU * random());
      const stars = compact ? 4200 : 7200;
      const dust = compact ? 500 : 900;
      const background = compact ? 550 : 900;
      vertexCount = stars + dust + background + 1;
      const data = new Float32Array(vertexCount * 13);
      for (let i = 0; i < vertexCount; i++) {
        const isDust = i >= stars && i < stars + dust;
        const isBackground = i >= stars + dust && i < vertexCount - 1;
        const coreGlow = i === vertexCount - 1;
        const core = i < (compact ? 55 : 90);
        const phase = random();
        const strand = i % 5;
        const across = gaussian() * (isDust ? .045 : .009 + random() * .016);
        const luminosity = random();
        let size = .45 + random() * 1.1;
        let alpha = .28 + random() * .5;
        if (luminosity > .94) { size = 2.3 + Math.pow(random(), 2) * 3.8; alpha = .85; }
        if (luminosity > .994) { size = 6 + random() * 2; alpha = 1.15; }
        let kind = core ? 4 : 0;
        if (core) { size = .6 + random() * 2; alpha = .35 + random() * .4; }
        if (isDust) { kind = 1; size = 2.5 + random() * 3; alpha = .16 + random() * .24; }
        if (isBackground) { kind = 2; size = .45 + Math.pow(random(), 8) * 2; alpha = .1 + random() * .3; }
        if (coreGlow) { kind = 3; size = compact ? 14 : 19; alpha = .75; }
        const warm = core || random() < .29;
        const color = coreGlow ? [1, .91, .78] : warm
          ? [1.1, .46 + random() * .3, .2 + random() * .2]
          : [.28 + random() * .2, .58 + random() * .2, 1.15];
        data.set([phase, strand, across, random(), size, alpha, kind, ...color,
          random() * 2 - 1, random() * 2 - 1, random()], i * 13);
      }
      positions = new Float32Array(vertexCount * 5);
      // x/y décalage, x/y vitesse, masse. Aucun objet créé par particule/frame.
      momentum = new Float32Array(vertexCount * 5);
      for (let i = 0; i < vertexCount; i++) momentum[i * 5 + 4] = .65 + 1.75 * smooth((data[i * 13 + 4] - 1) / 7);
      coastRemaining = 0; previousCursor = null;
      return data;
    }

    function buildPaths() {
      // Tracés propres au site : cinq courants inégaux, pas le chiffre de la référence.
      const definitions = [
        [1.28, 1.62, -.4, .22], [1.16, 1.49, -.17, -.24],
        [1.31, 1.57, -.62, .35], [1.07, 1.25, 2.8, -.28], [.96, 1.4, 3.08, .18]
      ];
      definitions.forEach(([radius, turns, phase, depth]) => {
        const table = new Float32Array(513 * 8);
        for (let j = 0; j <= 512; j++) {
          const phasePosition = j / 512;
          const t = phasePosition + .22 * Math.sin(TAU * phasePosition) / TAU;
          const r = .035 + radius * Math.pow(t, .82);
          const angle = phase + turns * TAU * Math.pow(t, .7);
          const x = Math.cos(angle) * r + .18 * t * t;
          const y = Math.sin(angle) * r * (1 + .14 * t) - .16 * t * t;
          table.set([x, y, Math.sin(t * Math.PI * 1.35 + phase) * depth * Math.sin(Math.PI * t), Math.cos(angle), Math.sin(angle),
            smooth(phasePosition / .055) * smooth((1 - phasePosition) / .055), .64 + .36 * Math.pow(Math.sin(Math.PI * t), .68), 0], j * 8);
        }
        paths.push(table);
      });
    }

    function clearMomentum() {
      cursor = previousCursor = null; coastRemaining = 0;
      if (momentum) for (let i = 0; i < vertexCount; i++) momentum.fill(0, i * 5, i * 5 + 4);
    }

    function updateParticles(dt) {
      const mix = (a, b, t) => a + (b - a) * t;
      const fract = n => n - Math.floor(n);
      const spread = reduced ? (scrollProgress > .5 ? 1 : 0) : scrollProgress;
      const opening = 1 - Math.pow(1 - (reduced ? 1 : intro), 3);
      const fieldX = rtl ? 1 - scene.x : scene.x;
      const rotations = [];
      for (let l = 0; l < 5; l++) {
        const lag = 1 - Math.exp(-dt * (returning ? 5.5 : 14) / (1 + (.18 + l * .17) * .68 * 2.5));
        layerYaw[l] += (yaw - layerYaw[l]) * lag;
        layerPitch[l] += (pitch - layerPitch[l]) * lag;
        const ay = -.13 + layerYaw[l] + pointerX * .2 + Math.sin(time * .11) * .10;
        const ax = -.30 + layerPitch[l] + pointerY * .10 + Math.sin(time * .09 + l * .1) * .06;
        rotations.push([Math.cos(ay), Math.sin(ay), Math.cos(ax), Math.sin(ax)]);
      }
      let dx = 0, dy = 0, segmentLength = 0, impulseX = 0, impulseY = 0;
      const strokes = cursor && previousCursor && !drag && scrollCooldown <= 0 && playing();
      if (strokes) {
        dx = cursor.x - previousCursor.x; dy = cursor.y - previousCursor.y;
        segmentLength = dx * dx + dy * dy;
        const cap = Math.min(1, height * .09 / Math.max(1, Math.sqrt(segmentLength)));
        impulseX = dx * cap; impulseY = dy * cap;
        if (segmentLength > .01) coastRemaining = 6;
      }
      const radius = Math.max(88, height * .0125);
      const returnDecay = Math.exp(-dt);
      const hasCoast = coastRemaining > 0;
      // Le rendu et la physique partagent cette projection : le sillage reste attaché aux étoiles.
      for (let i = 0, a = 0, o = 0; i < vertexCount; i++, a += 13, o += 5) {
        const seed = vertices[a + 3], kind = vertices[a + 6], layer = vertices[a + 1];
        const sx = vertices[a + 10], sy = vertices[a + 11], depth = vertices[a + 12];
        const phase = fract(vertices[a] - time * pathSpeeds[layer]);
        const index = phase * 512, j = Math.min(511, Math.floor(index)) * 8, f = index - Math.floor(index);
        const path = paths[layer], across = vertices[a + 2];
        let x = mix(path[j], path[j + 8], f) + path[j + 3] * across;
        let y = mix(path[j + 1], path[j + 9], f) + path[j + 4] * across;
        let z = mix(path[j + 2], path[j + 10], f) + sy * .035;
        let life = mix(path[j + 5], path[j + 13], f);
        let envelope = mix(path[j + 6], path[j + 14], f);
        if (kind >= 3) {
          const r = kind === 3 ? 0 : Math.pow(seed, 2.4) * .2;
          x = Math.cos(vertices[a] * TAU + time * .07) * r;
          y = Math.sin(vertices[a] * TAU + time * .07) * r * .75;
          z = sx * r * .6; life = 1; envelope = 1;
        }
        if (kind === 1) {
          const dustPhase = fract(seed + time * .036);
          x += path[j + 4] * (dustPhase - .5) * .13;
          y -= path[j + 3] * (dustPhase - .5) * .13;
          life *= smooth(dustPhase / .1) * smooth((1 - dustPhase) / .1);
          life *= .25 + .75 * Math.pow(.5 + .5 * Math.cos(TAU * (phase - time * pathSpeeds[layer] * .7)), 8);
        }
        const rotation = rotations[layer];
        const cy = rotation[0], syaw = rotation[1], cx = rotation[2], sp = rotation[3];
        const xx = x * cy + z * syaw, zz = z * cy - x * syaw;
        const yy = y * cx + zz * sp;
        z = zz * cx - y * sp;
        const perspective = 3.6 / (3.6 - z * .8);
        let px = anchorX + xx * scale * perspective * (1 + (1 - opening) * .75);
        let py = anchorY + yy * scale * perspective * (1 + (1 - opening) * .75);
        px += pointerX * (9 + z * 18); py += pointerY * (9 + z * 18);
        const disperse = kind === 2 ? 1 : spread;
        if (disperse > 0) {
          const speed = .4 + depth * .4;
          let fx = sx * .55 + .5 + Math.sin(seed * 29 + time * speed) * (.014 + depth * .025);
          let fy = fract(sy * .5 + .5 + travel * (.012 + depth * depth * .035) + Math.cos(seed * 41 + time * speed * .73) * .028);
          if (kind !== 2 && scene.ribbon > 0) {
            const along = fract(vertices[a] + time * .014) * 1.4 - .7;
            fx = mix(fx, along + .5, scene.ribbon);
            fy = mix(fy, .5 + Math.sin(along * 4 + travel * .45) * .3 + sy * .055, scene.ribbon);
          }
          if (kind !== 2 && scene.orbit > 0) {
            const angle = vertices[a] * TAU + time * (.045 + depth * .026);
            const radius = (.28 + depth * .14) * scene.spread;
            fx = mix(fx, fieldX + Math.cos(angle) * radius, scene.orbit);
            fy = mix(fy, scene.y + Math.sin(angle) * radius * .82 + sy * .018, scene.orbit);
          }
          const openingScale = Math.sin(disperse * Math.PI) * .2;
          px += (px - anchorX) * openingScale; py += (py - anchorY) * openingScale;
          px = mix(px, fx * width + pointerX * (8 + depth * 20), disperse);
          py = mix(py, fy * height + pointerY * (8 + depth * 20), disperse);
        }
        life = mix(life, 1, disperse);
        if (coastRemaining > 0 && dt > 0) {
          const mass = momentum[o + 4], dragRate = 2.3 / Math.sqrt(mass), decay = Math.exp(-dragRate * dt);
          const integration = (returnDecay - decay) / (dragRate - 1);
          momentum[o] = momentum[o] * returnDecay + momentum[o + 2] * integration;
          momentum[o + 1] = momentum[o + 1] * returnDecay + momentum[o + 3] * integration;
          momentum[o + 2] *= decay; momentum[o + 3] *= decay;
          if (segmentLength > .01 && kind < 3) {
            const ox = px + momentum[o] - previousCursor.x, oy = py + momentum[o + 1] - previousCursor.y;
            const projection = clamp((ox * dx + oy * dy) / segmentLength, 0, 1);
            const distance = Math.hypot(ox - dx * projection, oy - dy * projection);
            const weight = Math.pow(1 - smooth(distance / radius), 2);
            momentum[o + 2] += impulseX * weight * 5.4 / mass;
            momentum[o + 3] += impulseY * weight * 5.4 / mass;
            const limit = Math.min(1, height * .25 / Math.max(1, Math.hypot(momentum[o + 2], momentum[o + 3])));
            momentum[o + 2] *= limit; momentum[o + 3] *= limit;
          }
        }
        positions[o] = px + momentum[o]; positions[o + 1] = py + momentum[o + 1];
        positions[o + 2] = envelope * mix(perspective, .9 + depth * .35, disperse);
        positions[o + 3] = life;
        positions[o + 4] = hasCoast ? Math.min(1, Math.hypot(momentum[o + 2], momentum[o + 3]) / 100) : 0;
      }
      coastRemaining = Math.max(0, coastRemaining - dt);
      if (hasCoast && coastRemaining === 0) for (let i = 0; i < vertexCount; i++) momentum.fill(0, i * 5, i * 5 + 4);
      previousCursor = cursor && !drag && scrollCooldown <= 0 ? { ...cursor } : null;
      gl.bindBuffer(gl.ARRAY_BUFFER, motionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    }

    function freeResources() {
      if (!gl) return;
      freeTargets();
      if (post) { gl.deleteBuffer(post.buffer); gl.deleteProgram(post.program); post = null; }
      if (buffer) gl.deleteBuffer(buffer);
      if (motionBuffer) gl.deleteBuffer(motionBuffer);
      if (program) gl.deleteProgram(program);
      buffer = null; motionBuffer = null; program = null;
    }
    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Shader unavailable');
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error('Shader compilation failed');
      }
      return shader;
    }
    function freeTargets() {
      if (gl) targets.forEach(target => { gl.deleteTexture(target.texture); gl.deleteFramebuffer(target.framebuffer); });
      targets = []; targetWidth = targetHeight = 0;
    }
    function createPost() {
      let vs = null, fs = null, p = null, quad = null;
      try {
        vs = compile(gl.VERTEX_SHADER, screenVertex); fs = compile(gl.FRAGMENT_SHADER, screenFragment);
        p = gl.createProgram();
        if (!p) throw new Error('Post program unavailable');
        gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Post link failed');
        quad = gl.createBuffer();
        if (!quad) throw new Error('Post buffer unavailable');
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(p, 'aPosition');
        if (position < 0) throw new Error('Post attribute unavailable');
        const locations = {};
        ['uScene', 'uBloom', 'uWide', 'uDirection', 'uPass'].forEach(name => {
          locations[name] = gl.getUniformLocation(p, name);
          if (locations[name] === null) throw new Error('Post uniform unavailable');
        });
        return { program: p, buffer: quad, position, uniforms: locations };
      } catch (_) {
        if (quad) gl.deleteBuffer(quad);
        if (p) gl.deleteProgram(p);
        return null;
      } finally {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      }
    }
    function resizeTargets(w, h) {
      if (!post || (w === targetWidth && h === targetHeight)) return;
      freeTargets();
      try {
        const half = gl.getExtension('OES_texture_half_float');
        const linear = gl.getExtension('OES_texture_half_float_linear');
        const color = gl.getExtension('EXT_color_buffer_half_float');
        targetType = half && linear && color ? half.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
        for (const ratio of [1, 0.5, 0.5, 0.125, 0.125]) {
          const target = { width: Math.max(1, Math.round(w * ratio)), height: Math.max(1, Math.round(h * ratio)), texture: gl.createTexture(), framebuffer: gl.createFramebuffer() };
          targets.push(target);
          if (!target.texture || !target.framebuffer) throw new Error('Render target unavailable');
          gl.bindTexture(gl.TEXTURE_2D, target.texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, target.width, target.height, 0, gl.RGBA, targetType, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
          if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Incomplete render target');
        }
        targetWidth = w; targetHeight = h;
      } catch (_) {
        // Le rendu direct reste utilisable sur les appareils sans cibles hors écran.
        freeTargets(); gl.deleteBuffer(post.buffer); gl.deleteProgram(post.program); post = null;
      } finally { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      canvas.dataset.bloom = post ? 'multi-scale' : 'unavailable';
      canvas.dataset.dynamicRange = post && targetType !== gl.UNSIGNED_BYTE ? 'hdr' : 'standard';
    }
    function composite() {
      attributes.forEach(attribute => gl.disableVertexAttribArray(attribute.location));
      motionAttributes.forEach(attribute => gl.disableVertexAttribArray(attribute.location));
      gl.disable(gl.BLEND); gl.useProgram(post.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, post.buffer);
      gl.enableVertexAttribArray(post.position);
      gl.vertexAttribPointer(post.position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1i(post.uniforms.uScene, 0); gl.uniform1i(post.uniforms.uBloom, 1); gl.uniform1i(post.uniforms.uWide, 2);
      const pass = (source, target, mode, x = 0, y = 0) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.framebuffer : null);
        gl.viewport(0, 0, target ? target.width : canvas.width, target ? target.height : canvas.height);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, source.texture);
        gl.uniform1f(post.uniforms.uPass, mode); gl.uniform2f(post.uniforms.uDirection, x, y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
      // Les unités secondaires sont détachées pendant les passes pour éviter tout feedback.
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, null);
      pass(targets[0], targets[1], 0);
      pass(targets[1], targets[2], 1, 1 / targets[1].width, 0);
      pass(targets[2], targets[1], 1, 0, 1 / targets[1].height);
      pass(targets[1], targets[3], 1, 1 / targets[3].width, 0);
      pass(targets[3], targets[4], 1, 0, 1 / targets[4].height);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, targets[1].texture);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, targets[4].texture);
      pass(targets[0], null, 2);
      gl.disableVertexAttribArray(post.position);
    }
    function createResources() {
      freeResources();
      let vs = null, fs = null;
      try {
        vs = compile(gl.VERTEX_SHADER, vertexShader);
        fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
        program = gl.createProgram();
        if (!program) throw new Error('Program unavailable');
        gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program link failed');
        gl.useProgram(program);
        buffer = gl.createBuffer();
        if (!buffer) throw new Error('Buffer unavailable');
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        attributes = [['aOrbit', 4, 0], ['aStyle', 3, 4], ['aColor', 3, 7], ['aScatter', 3, 10]].map(([name, size, offset]) => {
          const location = gl.getAttribLocation(program, name);
          if (location < 0) throw new Error('Attribute unavailable');
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, size, gl.FLOAT, false, 13 * 4, offset * 4);
          return { location, size, offset: offset * 4 };
        });
        if (vertices) gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        motionBuffer = gl.createBuffer();
        if (!motionBuffer) throw new Error('Motion buffer unavailable');
        gl.bindBuffer(gl.ARRAY_BUFFER, motionBuffer);
        motionAttributes = [['aScreen', 4, 0], ['aEnergy', 1, 16]].map(([name, size, offset]) => {
          const location = gl.getAttribLocation(program, name);
          if (location < 0) throw new Error('Motion attribute unavailable');
          return { location, size, offset };
        });
        if (positions) gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);
        uniforms = {};
        ['uViewport', 'uCamera', 'uPointer', 'uHover', 'uTime', 'uIntro', 'uScroll', 'uDpr', 'uPointMax', 'uMobile', 'uRtl', 'uScene', 'uReading'].forEach(name => {
          uniforms[name] = gl.getUniformLocation(program, name);
          if (uniforms[name] === null) throw new Error('Uniform unavailable');
        });
        maxPoint = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
        gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);
        // Canvas opaque : évite la seconde prémultiplication du compositeur HTML.
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.clearColor(0.025, 0.04, 0.065, 1);
        post = createPost();
        if (!post) canvas.dataset.bloom = 'unavailable';
        return true;
      } catch (_) {
        freeResources(); return false;
      } finally {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      }
    }
    function setAvailability(value) {
      available = value;
      canvas.hidden = !value;
      if (surface) surface.hidden = !value;
      if (hint) hint.hidden = !value;
      if (replay) replay.hidden = !value;
      document.body.classList.toggle('galaxy-unavailable', !value);
      canvas.dataset.renderer = value ? 'webgl' : 'fallback';
      updateControls();
    }
    function measureScene() {
      const probe = height * 0.46;
      const sections = chapters.map(element => ({ element, top: element.getBoundingClientRect().top }));
      let index = 0;
      while (index < sections.length - 1 && sections[index + 1].top <= probe) index++;
      const current = sections[index], next = sections[index + 1];
      const name = current ? current.element.dataset.cosmos : 'reading';
      const a = profiles[name] || profiles.reading;
      const b = next ? profiles[next.element.dataset.cosmos] || profiles.reading : a;
      let blend = next ? smooth((probe - current.top) / Math.max(1, next.top - current.top)) : 0;
      if (reduced) blend = blend > 0.5 ? 1 : 0;
      for (const key of Object.keys(a)) scene[key] = a[key] + (b[key] - a[key]) * blend;
      travel = index + blend;
      canvas.dataset.composition = name;
    }
    function measure() {
      needsMeasure = false;
      width = Math.max(1, stage.clientWidth || window.innerWidth);
      height = Math.max(1, stage.clientHeight || window.innerHeight);
      mobile = width <= 900; rtl = root.dir === 'rtl';
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      surfaceRect = sceneWindow ? sceneWindow.getBoundingClientRect() : { left:0, top:0, width, height };
      const heroRect = hasHero ? hero.getBoundingClientRect() : null;
      // Le plan suit le hero, puis les mêmes étoiles forment les scènes suivantes.
      anchorX = surfaceRect.left + surfaceRect.width * 0.5;
      anchorY = Math.max(-height * 0.3, surfaceRect.top + surfaceRect.height * 0.48);
      scale = Math.min(surfaceRect.width * 0.45, surfaceRect.height * 0.45);
      scrollProgress = heroRect ? smooth(-heroRect.top / Math.max(1, heroRect.height * (mobile ? 0.48 : 0.85))) : 1;
      if (heroRect && heroRect.bottom < 0) cancelDrag();
      measureScene(); updateControls();
      if (!available || lost) return;
      const w = Math.round(width * dpr), h = Math.round(height * dpr);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      gl.viewport(0, 0, w, h);
      resizeTargets(w, h);
      const nextQuality = mobile ? 'compact' : 'full';
      if (quality !== nextQuality) {
        quality = nextQuality; vertices = buildGeometry(mobile);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, motionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);
        canvas.dataset.particles = String(vertexCount);
      }
    }
    function draw() {
      if (!available || lost || !program || !pageActive || document.hidden) return;
      updateParticles(playing() ? clamp(time - simulatedTime, 0, .05) : 0);
      simulatedTime = time;
      const hasBloom = post && targets.length === 5;
      gl.bindFramebuffer(gl.FRAMEBUFFER, hasBloom ? targets[0].framebuffer : null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(hasBloom ? 0 : 0.016, hasBloom ? 0 : 0.026, hasBloom ? 0 : 0.037, 1);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      attributes.forEach(attribute => {
        gl.enableVertexAttribArray(attribute.location);
        gl.vertexAttribPointer(attribute.location, attribute.size, gl.FLOAT, false, 52, attribute.offset);
      });
      gl.bindBuffer(gl.ARRAY_BUFFER, motionBuffer);
      motionAttributes.forEach(attribute => {
        gl.enableVertexAttribArray(attribute.location);
        gl.vertexAttribPointer(attribute.location, attribute.size, gl.FLOAT, false, 20, attribute.offset);
      });
      gl.uniform2f(uniforms.uViewport, width, height);
      gl.uniform2f(uniforms.uCamera, -0.58 + pitch + pointerY * 0.16, -0.16 + yaw + pointerX * 0.28);
      gl.uniform2f(uniforms.uPointer, pointerX, pointerY);
      gl.uniform1f(uniforms.uHover, cursor && playing() ? 1 : 0);
      gl.uniform4f(uniforms.uScene, scene.ribbon, scene.orbit, scene.light, scene.spread);
      gl.uniform2f(uniforms.uReading, rtl ? 1 - scene.clearX : scene.clearX, mobile ? Math.min(scene.clearWidth, 0.28) : scene.clearWidth);
      gl.uniform1f(uniforms.uTime, time);
      gl.uniform1f(uniforms.uIntro, reduced ? 1 : intro);
      // Sans mouvement, on change de composition sans dispersion interpolée.
      gl.uniform1f(uniforms.uScroll, reduced ? (scrollProgress > 0.5 ? 1 : 0) : scrollProgress);
      gl.uniform1f(uniforms.uDpr, dpr);
      gl.uniform1f(uniforms.uPointMax, maxPoint);
      gl.uniform1f(uniforms.uMobile, mobile ? 1 : 0); gl.uniform1f(uniforms.uRtl, rtl ? 1 : 0);
      gl.drawArrays(gl.POINTS, 0, vertexCount);
      if (hasBloom) composite();
    }
    function playing() {
      return available && !lost && !paused && !reduced && pageActive && !document.hidden;
    }
    function tick(timestamp) {
      frame = 0;
      if (needsMeasure) measure();
      const animate = playing();
      if (animate) {
        const dt = lastTime ? clamp((timestamp - lastTime) / 1000, 0, 0.05) : 0;
        lastTime = timestamp; time += dt; intro = Math.min(1, intro + dt / 5.5);
        scrollCooldown = Math.max(0, scrollCooldown - dt);
        const damping = 1 - Math.exp(-dt * 5.5);
        pointerX += (hoverX - pointerX) * damping;
        pointerY += (hoverY - pointerY) * damping;
        if (!drag && returning) targetYaw = targetPitch = 0;
        yaw += (targetYaw - yaw) * (1 - Math.exp(-dt * (returning ? 5.5 : 14)));
        pitch += (targetPitch - pitch) * (1 - Math.exp(-dt * (returning ? 5.5 : 14)));
      } else lastTime = 0;
      // Le fond de lecture reste animé à 30 images/s ; priorité au contenu et à la batterie.
      const interval = scrollProgress > 0.95 || mobile ? 1000 / 30 : 1000 / 60;
      if (dirty || (animate && timestamp - lastDraw >= interval - 1)) { draw(); lastDraw = timestamp; }
      dirty = false;
      if (animate) frame = requestAnimationFrame(tick);
    }
    function schedule(measureLayout = false) {
      dirty = true; needsMeasure = needsMeasure || measureLayout;
      if (!pageActive || document.hidden || lost) return;
      if (!frame) frame = requestAnimationFrame(tick);
    }
    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; lastTime = 0; lastDraw = 0;
    }
    function releaseDrag() {
      if (!drag) return;
      const id = drag.id; drag = null;
      returning = true; previousCursor = null;
      surface.dataset.dragging = 'false';
      if (surface.hasPointerCapture && surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    }
    function updateControls() {
      if (surface) surface.disabled = !available || paused || reduced || lost || scrollProgress > 0.9;
      if (replay) {
        replay.disabled = !available || paused || reduced || lost;
        replay.hidden = !available || scrollProgress > 0.12;
      }
      if (hint) hint.style.opacity = paused || reduced ? '0' : '1';
      if (!motion) return;
      motion.setAttribute('aria-pressed', String(paused));
      const label = motion.querySelector('span[data-i18n]');
      const icon = motion.querySelector('i');
      const key = paused ? 'motion_play' : 'motion_pause';
      if (label) {
        label.dataset.i18n = key;
        label.textContent = typeof window.i18nT === 'function' ? window.i18nT(key) : paused ? 'Reprendre les animations' : 'Mettre les animations en pause';
        motion.setAttribute('aria-label', label.textContent);
      }
      if (icon) { icon.classList.toggle('fa-play', paused); icon.classList.toggle('fa-pause', !paused); }
    }
    function setPause(value) {
      paused = value; root.classList.toggle('motion-paused', paused);
      try { sessionStorage.setItem('hq-motion-paused', String(paused)); } catch (_) { /* Stockage facultatif. */ }
      if (paused) { releaseDrag(); velocityYaw = velocityPitch = 0; previousCursor = cursor = null; }
      updateControls();
      window.dispatchEvent(new CustomEvent('hq:motionchange', { detail: { paused } }));
      stop(); schedule();
    }
    function resetView(restart) {
      releaseDrag();
      clearMomentum(); returning = true;
      targetYaw = targetPitch = velocityYaw = velocityPitch = hoverX = hoverY = 0;
      if (restart) { intro = 0; time = simulatedTime = 0; yaw = pitch = pointerX = pointerY = 0; layerYaw.fill(0); layerPitch.fill(0); }
      schedule();
    }
    surface?.addEventListener('pointerdown', event => {
      if (!playing() || (event.button !== undefined && event.button !== 0) || event.isPrimary === false) return;
      velocityYaw = velocityPitch = 0;
      returning = false; previousCursor = cursor = null;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, t: event.timeStamp, touch: event.pointerType === 'touch', accepted: event.pointerType !== 'touch' };
      if (drag.accepted) { surface.setPointerCapture(event.pointerId); surface.dataset.dragging = 'true'; }
    });
    surface?.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id || !playing()) return;
      if (!drag.accepted) {
        const dx = Math.abs(event.clientX - drag.startX), dy = Math.abs(event.clientY - drag.startY);
        if (dy > 8 && dy > dx) { releaseDrag(); return; }
        if (dx < 8) return;
        drag.accepted = true; surface.setPointerCapture(event.pointerId); surface.dataset.dragging = 'true';
      }
      const deltaX = event.clientX - drag.x, deltaY = event.clientY - drag.y;
      const dt = clamp((event.timeStamp - drag.t) / 1000, 0.008, 0.08);
      targetYaw = clamp(targetYaw + deltaX * 0.005, -Math.PI * 4, Math.PI * 4);
      targetPitch = clamp(targetPitch + deltaY * 0.005, -1.2, 1.2);
      velocityYaw = clamp(deltaX * 0.006 / dt, -2.5, 2.5);
      velocityPitch = clamp(deltaY * 0.004 / dt, -1.5, 1.5);
      drag.x = event.clientX; drag.y = event.clientY; drag.t = event.timeStamp;
    });
    surface?.addEventListener('pointerup', event => {
      if (drag && event.pointerId === drag.id) {
        // Un geste arrêté avant le relâchement ne doit pas créer un élan tardif.
        if (event.timeStamp - drag.t > 100) velocityYaw = velocityPitch = 0;
        releaseDrag();
      }
    });
    const cancelDrag = () => { releaseDrag(); velocityYaw = velocityPitch = 0; };
    surface?.addEventListener('pointercancel', cancelDrag);
    surface?.addEventListener('lostpointercapture', () => { if (drag) cancelDrag(); });
    surface?.addEventListener('keydown', event => {
      if (!playing()) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Escape'].includes(event.key)) return;
      event.preventDefault(); cancelDrag();
      returning = false;
      if (event.key === 'Home' || event.key === 'Escape') resetView(false);
      else if (event.key === 'ArrowLeft') targetYaw -= 0.16;
      else if (event.key === 'ArrowRight') targetYaw += 0.16;
      else targetPitch = clamp(targetPitch + (event.key === 'ArrowUp' ? -0.12 : 0.12), -0.9, 1.1);
      schedule();
    });
    window.addEventListener('pointermove', event => {
      if (event.buttons > 0) { cursor = previousCursor = null; return; }
      if (!playing() || drag || event.pointerType === 'touch' || event.isPrimary === false) return;
      // Écoute passive sur toute la page : ne capture ni liens, ni sélection, ni scroll.
      hoverX = clamp(event.clientX / width * 2 - 1, -1, 1);
      hoverY = clamp(event.clientY / height * 2 - 1, -1, 1);
      cursor = { x:event.clientX, y:event.clientY };
    }, { passive: true });
    window.addEventListener('pointerdown', () => { cursor = previousCursor = null; }, { passive:true });
    window.addEventListener('pointerout', event => { if (!event.relatedTarget) { hoverX = hoverY = 0; previousCursor = cursor = null; } }, { passive:true });
    window.addEventListener('blur', () => { hoverX = hoverY = 0; cancelDrag(); clearMomentum(); });
    if (replay) replay.addEventListener('click', () => { if (!paused && !reduced) resetView(true); });
    if (motion) motion.addEventListener('click', () => setPause(!paused));
    window.addEventListener('scroll', () => { scrollCooldown = .12; previousCursor = null; schedule(true); }, { passive: true });
    window.addEventListener('resize', () => { clearMomentum(); schedule(true); }, { passive: true });
    window.addEventListener('hq:languagechange', () => { updateControls(); schedule(true); });
    const onReduced = event => {
      reduced = event.matches;
      if (reduced) { intro = 1; hoverX = hoverY = pointerX = pointerY = 0; cancelDrag(); clearMomentum(); }
      updateControls(); stop(); schedule();
    };
    if (media.addEventListener) media.addEventListener('change', onReduced);
    else media.addListener(onReduced);
    document.addEventListener('visibilitychange', () => { cancelDrag(); clearMomentum(); stop(); if (!document.hidden) schedule(true); });
    window.addEventListener('pagehide', event => {
      try { sessionStorage.setItem('hq-cosmos-time', String(time)); } catch (_) { /* Stockage facultatif. */ }
      pageActive = false; cancelDrag(); stop();
      if (!event.persisted) freeResources();
    });
    window.addEventListener('pageshow', event => {
      pageActive = true;
      if (event.persisted) {
        try {
          const savedTime = sessionStorage.getItem('hq-cosmos-time');
          if (savedTime !== null) time = clamp(Number(savedTime) || 0, 0, 100000);
          const savedPause = sessionStorage.getItem('hq-motion-paused');
          if (savedPause !== null) setPause(savedPause === 'true');
        } catch (_) { /* Le retour arrière fonctionne aussi sans stockage. */ }
      }
      if (gl && !program && !lost) setAvailability(createResources());
      schedule(true);
    });
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); lost = true; cancelDrag(); stop();
      program = null; buffer = null; motionBuffer = null; post = null; targets = []; targetWidth = targetHeight = 0;
      clearMomentum();
      setAvailability(false);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      lost = false; setAvailability(createResources()); schedule(true);
    });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => schedule(true));
      observer.observe(document.body);
      if (sceneWindow) observer.observe(sceneWindow);
    }
    if (document.fonts) document.fonts.ready.then(() => schedule(true));
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    } catch (_) { gl = null; }
    buildPaths();
    setAvailability(Boolean(gl && createResources()));
    setPause(paused); schedule(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(Math);

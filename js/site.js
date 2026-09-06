// Comportements partagés par toutes les pages du site
(() => {
  'use strict';

  // État de mouvement commun : préférence système dynamique + pause applicative.
  const reducedMotion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  let motionPaused = false;
  const motionListeners = new Set();
  const motionAllowed = () => !motionPaused && !(reducedMotion && reducedMotion.matches);

  function notifyMotionChange() {
    motionListeners.forEach(listener => listener(motionAllowed()));
  }

  function subscribeToMotion(listener) {
    motionListeners.add(listener);
    return () => motionListeners.delete(listener);
  }

  function handleMotionPreference() {
    notifyMotionChange();
  }

  if (reducedMotion) {
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(handleMotionPreference);
    }
  }

  function handleMotionEvent(event) {
    if (!event.detail || typeof event.detail.paused !== 'boolean') return;
    if (motionPaused === event.detail.paused) return;
    motionPaused = event.detail.paused;
    notifyMotionChange();
  }

  // L'événement peut être envoyé sur document ou window selon l'intégration.
  document.addEventListener('hq:motionchange', handleMotionEvent);
  window.addEventListener('hq:motionchange', handleMotionEvent);

  // Navigation : toutes les pages ne possèdent pas nécessairement ces éléments.
  const nav = document.getElementById('nav');
  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navlinks');
  if (burger && navLinks) {
    const menuBoundary = nav || burger.closest('nav') || navLinks.closest('nav') || burger.parentElement;
    const menuIsOpen = () => navLinks.classList.contains('open');

    function setMenuOpen(open, returnFocus = false) {
      navLinks.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      if (!open && returnFocus) burger.focus();
    }

    setMenuOpen(false);
    burger.addEventListener('click', () => setMenuOpen(!menuIsOpen()));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('pointerdown', event => {
      if (menuIsOpen() && menuBoundary && !menuBoundary.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuIsOpen()) setMenuOpen(false, true);
    });

    const desktopNav = typeof window.matchMedia === 'function'
      ? window.matchMedia('(min-width: 901px)')
      : null;
    const closeDesktopMenu = event => {
      if (event.matches) setMenuOpen(false);
    };
    if (desktopNav) {
      if (typeof desktopNav.addEventListener === 'function') {
        desktopNav.addEventListener('change', closeDesktopMenu);
      } else if (typeof desktopNav.addListener === 'function') {
        desktopNav.addListener(closeDesktopMenu);
      }
    }
  }

  // Révélations progressives : le contenu reste visible sans JS. WAAPI ajoute
  // seulement une courte entrée translate + opacity, sans boîte de découpe.
  const revealElements = [...document.querySelectorAll('.reveal')];
  const revealAnimations = new Set();

  function reveal(element, delay = 0) {
    element.classList.add('in');
    // Évite une double animation si une ancienne règle CSS `rise` subsiste.
    if (typeof element.getAnimations === 'function') {
      element.getAnimations().forEach(animation => {
        if (animation.animationName === 'rise') animation.cancel();
      });
    }
    if (!motionAllowed() || typeof element.animate !== 'function') return;

    const animation = element.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ],
      {
        duration: 420,
        delay,
        easing: 'cubic-bezier(.2,.75,.25,1)',
        fill: 'backwards'
      }
    );
    revealAnimations.add(animation);
    animation.finished
      .catch(() => {})
      .finally(() => revealAnimations.delete(animation));
  }

  subscribeToMotion(allowed => {
    if (!allowed) {
      revealAnimations.forEach(animation => animation.cancel());
      revealAnimations.clear();
    }
  });

  if (revealElements.length) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        visible.forEach((entry, index) => {
          revealObserver.unobserve(entry.target);
          reveal(entry.target, Math.min(index * 55, 220));
        });
      }, { threshold: 0.12 });
      revealElements.forEach(element => revealObserver.observe(element));
    } else {
      revealElements.forEach((element, index) => reveal(element, Math.min(index * 35, 210)));
    }
  }

  // Carrousel des captures dans le téléphone (accueil uniquement).
  const phoneTrack = document.getElementById('track');
  if (phoneTrack && phoneTrack.children.length) {
    const slides = [...phoneTrack.children];
    const slideCount = slides.length;
    const dots = [...document.querySelectorAll('.phone-dot[data-slide]')];
    const previousButton = document.getElementById('phone-prev');
    const nextButton = document.getElementById('phone-next');
    const currentCounter = document.getElementById('phone-current');
    const totalCounter = document.getElementById('phone-total');
    const carouselRoot = phoneTrack.closest('.hero-visual') || phoneTrack.parentElement;
    const phoneDevice = phoneTrack.closest('.device-stage');
    let currentSlide = 0;
    let phoneTimer = 0;
    let phoneVisible = true;
    let phoneHovered = false;
    let phoneFocused = carouselRoot ? carouselRoot.contains(document.activeElement) : false;

    if (!phoneTrack.hasAttribute('role')) phoneTrack.setAttribute('role', 'group');
    phoneTrack.setAttribute('aria-live', 'off');
    phoneTrack.setAttribute('aria-roledescription', 'carousel');
    if (totalCounter) totalCounter.textContent = String(slideCount).padStart(2, '0');

    const parsedDotSlides = dots.map(dot => Number.parseInt(dot.dataset.slide, 10));
    const dotsAreOneBased = parsedDotSlides.length > 0
      && !parsedDotSlides.includes(0)
      && parsedDotSlides.every(value => Number.isInteger(value) && value >= 1 && value <= slideCount);

    function slideForDot(dot, fallbackIndex) {
      const value = Number.parseInt(dot.dataset.slide, 10);
      if (!Number.isInteger(value)) return Math.min(fallbackIndex, slideCount - 1);
      const index = dotsAreOneBased ? value - 1 : value;
      return Math.min(Math.max(index, 0), slideCount - 1);
    }

    const dotSlides = dots.map(slideForDot);

    function updatePhoneState() {
      slides.forEach((slide, index) => {
        if (index === currentSlide) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
      dots.forEach((dot, index) => {
        const active = dotSlides[index] === currentSlide;
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
        dot.tabIndex = active ? 0 : -1;
      });
      if (currentCounter) currentCounter.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    function goToPhoneSlide(index, animate = true) {
      const direction = Math.sign(index - currentSlide);
      const previousFormat = slides[currentSlide].dataset.screenFormat || 'current';
      currentSlide = (index % slideCount + slideCount) % slideCount;
      const screenFormat = slides[currentSlide].dataset.screenFormat || 'current';
      // Géométrie synchronisée même sans animation, en pause ou avant le lazy load.
      if (phoneDevice) phoneDevice.dataset.screenFormat = screenFormat;
      // Deux formats ne défilent pas dans une ouverture intermédiaire : ni bandes,
      // ni recadrage. Les transitions entre captures de même format sont conservées.
      phoneTrack.style.transition = animate && motionAllowed() && previousFormat === screenFormat ? '' : 'none';
      phoneTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      updatePhoneState();
      if (animate && direction && motionAllowed()) {
        window.dispatchEvent(new CustomEvent('hq:deviceslide', { detail: { direction } }));
      }
    }

    function phoneCanAutoplay() {
      return slideCount > 1
        && motionAllowed()
        && !document.hidden
        && phoneVisible
        && !phoneHovered
        && !phoneFocused;
    }

    function restartPhoneAutoplay() {
      window.clearTimeout(phoneTimer);
      phoneTimer = 0;
      if (!phoneCanAutoplay()) return;
      phoneTimer = window.setTimeout(() => {
        goToPhoneSlide(currentSlide + 1);
        restartPhoneAutoplay();
      }, 5000);
    }

    function selectPhoneSlide(index) {
      goToPhoneSlide(index);
      restartPhoneAutoplay();
    }

    dots.forEach((dot, dotIndex) => {
      const targetSlide = dotSlides[dotIndex];
      dot.type = 'button';
      if (phoneTrack.id) dot.setAttribute('aria-controls', phoneTrack.id);
      if (!dot.hasAttribute('aria-label')) {
        const slideName = slides[targetSlide]?.getAttribute('alt');
        dot.setAttribute('aria-label', slideName || `${targetSlide + 1}/${slideCount}`);
      }
      dot.addEventListener('click', () => selectPhoneSlide(targetSlide));
      dot.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextDot = dotIndex;
        if (event.key === 'ArrowLeft') nextDot = (dotIndex - 1 + dots.length) % dots.length;
        if (event.key === 'ArrowRight') nextDot = (dotIndex + 1) % dots.length;
        if (event.key === 'Home') nextDot = 0;
        if (event.key === 'End') nextDot = dots.length - 1;
        dots[nextDot].focus();
        selectPhoneSlide(dotSlides[nextDot]);
      });
    });

    if (previousButton) {
      previousButton.addEventListener('click', () => selectPhoneSlide(currentSlide - 1));
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => selectPhoneSlide(currentSlide + 1));
    }

    if (carouselRoot) {
      carouselRoot.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        phoneHovered = true;
        restartPhoneAutoplay();
      });
      carouselRoot.addEventListener('pointerleave', event => {
        if (event.pointerType === 'touch') return;
        phoneHovered = false;
        restartPhoneAutoplay();
      });
      carouselRoot.addEventListener('focusin', () => {
        phoneFocused = true;
        restartPhoneAutoplay();
      });
      carouselRoot.addEventListener('focusout', event => {
        phoneFocused = Boolean(event.relatedTarget && carouselRoot.contains(event.relatedTarget));
        restartPhoneAutoplay();
      });

      if ('IntersectionObserver' in window) {
        const phoneObserver = new IntersectionObserver(entries => {
          phoneVisible = entries[0]?.isIntersecting ?? true;
          restartPhoneAutoplay();
        }, { threshold: 0.15 });
        phoneObserver.observe(carouselRoot);
      }
    }

    document.addEventListener('visibilitychange', restartPhoneAutoplay);
    subscribeToMotion(allowed => {
      if (!allowed) {
        phoneTrack.style.transition = 'none';
        phoneTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
      restartPhoneAutoplay();
    });
    window.addEventListener('pagehide', () => window.clearTimeout(phoneTimer));
    window.addEventListener('pageshow', restartPhoneAutoplay);

    goToPhoneSlide(0, false);
    restartPhoneAutoplay();
  }

  // Tutoriels — carrousel + lecteur (accueil uniquement).
  const tutorials = document.getElementById('tutoriels');
  if (tutorials) {
    const tabs = [...tutorials.querySelectorAll('.tuto-tab')];
    const tracks = [...tutorials.querySelectorAll('.tuto-track')];
    const carousel = tutorials.querySelector('.tuto-carousel');
    const playlistLink = tutorials.querySelector('.tuto-yt');
    const activeTrack = () => tracks.find(track => !track.hidden);
    let coverflowFrame = 0;
    let tutorialTimer = 0;
    let tutorialVisible = true;
    let tutorialHovered = false;
    let tutorialFocused = tutorials.contains(document.activeElement);
    let tutorialInteracting = false;
    let modalOpen = false;

    function resetCoverflow(track) {
      if (!track) return;
      track.querySelectorAll('.tuto-card').forEach(card => {
        card.style.transform = '';
        card.style.opacity = '';
      });
    }

    function coverflow(track) {
      if (!track) return;
      if (!motionAllowed()) {
        resetCoverflow(track);
        return;
      }
      if (track.hidden) return;

      const trackRect = track.getBoundingClientRect();
      if (!Number.isFinite(trackRect.width) || trackRect.width <= 0) return;
      const centre = trackRect.left + trackRect.width / 2;
      track.querySelectorAll('.tuto-card').forEach(card => {
        const cardRect = card.getBoundingClientRect();
        if (!Number.isFinite(cardRect.width) || cardRect.width <= 0) return;
        const distance = Math.min(
          Math.abs(cardRect.left + cardRect.width / 2 - centre) / trackRect.width,
          0.6
        );
        const scale = 1 - distance * 0.22;
        const opacity = 1 - distance * 0.55;
        if (!Number.isFinite(scale) || !Number.isFinite(opacity)) return;
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      });
    }

    function scheduleCoverflow(track = activeTrack()) {
      window.cancelAnimationFrame(coverflowFrame);
      coverflowFrame = window.requestAnimationFrame(() => coverflow(track));
    }

    tracks.forEach(track => {
      track.addEventListener('scroll', () => scheduleCoverflow(track), { passive: true });
      coverflow(track);
    });
    window.addEventListener('resize', () => scheduleCoverflow(), { passive: true });

    function scrollTrackTo(track, left) {
      const options = { left, behavior: motionAllowed() ? 'smooth' : 'auto' };
      if (typeof track.scrollTo === 'function') track.scrollTo(options);
      else track.scrollLeft = left;
    }

    // Avancer/reculer d'une carte, en boucle.
    function stepTutorial(direction) {
      const track = activeTrack();
      const card = track?.querySelector('.tuto-card');
      if (!track || !card || track.hidden || track.clientWidth <= 0) return;

      const cardWidth = card.getBoundingClientRect().width;
      if (!Number.isFinite(cardWidth) || cardWidth <= 0) return;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 18;
      const stepWidth = cardWidth + gap;
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      let left = track.scrollLeft + direction * stepWidth;
      if (direction > 0 && track.scrollLeft >= max - 8) left = 0;
      if (direction < 0 && track.scrollLeft <= 8) left = max;
      scrollTrackTo(track, Math.min(Math.max(left, 0), max));
    }

    function tutorialCanAutoplay() {
      return Boolean(carousel)
        && motionAllowed()
        && !document.hidden
        && tutorialVisible
        && !tutorialHovered
        && !tutorialFocused
        && !tutorialInteracting
        && !modalOpen;
    }

    function restartTutorialAutoplay() {
      window.clearTimeout(tutorialTimer);
      tutorialTimer = 0;
      if (!tutorialCanAutoplay()) return;
      tutorialTimer = window.setTimeout(() => {
        stepTutorial(1);
        restartTutorialAutoplay();
      }, 5000);
    }

    const previousTutorial = tutorials.querySelector('.tuto-nav.prev');
    const nextTutorial = tutorials.querySelector('.tuto-nav.next');
    previousTutorial?.addEventListener('click', () => {
      stepTutorial(-1);
      restartTutorialAutoplay();
    });
    nextTutorial?.addEventListener('click', () => {
      stepTutorial(1);
      restartTutorialAutoplay();
    });

    if (carousel) {
      carousel.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        tutorialHovered = true;
        restartTutorialAutoplay();
      });
      carousel.addEventListener('pointerleave', event => {
        if (event.pointerType === 'touch') return;
        tutorialHovered = false;
        restartTutorialAutoplay();
      });
      carousel.addEventListener('pointerdown', () => {
        tutorialInteracting = true;
        restartTutorialAutoplay();
      });
    }

    ['pointerup', 'pointercancel'].forEach(eventName => {
      window.addEventListener(eventName, () => {
        if (!tutorialInteracting) return;
        tutorialInteracting = false;
        restartTutorialAutoplay();
      });
    });

    tutorials.addEventListener('focusin', () => {
      tutorialFocused = true;
      restartTutorialAutoplay();
    });
    tutorials.addEventListener('focusout', event => {
      tutorialFocused = Boolean(event.relatedTarget && tutorials.contains(event.relatedTarget));
      restartTutorialAutoplay();
    });

    if ('IntersectionObserver' in window) {
      const tutorialObserver = new IntersectionObserver(entries => {
        tutorialVisible = entries[0]?.isIntersecting ?? true;
        restartTutorialAutoplay();
      }, { threshold: 0.08 });
      tutorialObserver.observe(tutorials);
    }

    document.addEventListener('visibilitychange', restartTutorialAutoplay);
    subscribeToMotion(allowed => {
      if (!allowed) {
        tracks.forEach(track => {
          resetCoverflow(track);
          // Interrompt aussi un éventuel défilement fluide en cours.
          if (typeof track.scrollTo === 'function') {
            track.scrollTo({ left: track.scrollLeft, behavior: 'auto' });
          }
        });
      } else {
        scheduleCoverflow();
      }
      restartTutorialAutoplay();
    });

    // Onglets (une playlist par onglet).
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(button => {
        const active = button === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      tracks.forEach(track => {
        track.hidden = track.dataset.pl !== tab.dataset.pl;
      });
      const track = activeTrack();
      if (!track) return;
      scrollTrackTo(track, 0);
      scheduleCoverflow(track);
      if (playlistLink) {
        playlistLink.href = `https://www.youtube.com/playlist?list=${encodeURIComponent(track.dataset.list || '')}`;
      }
      restartTutorialAutoplay();
    }));

    tabs.forEach(tab => {
      tab.setAttribute('aria-pressed', String(tab.classList.contains('active')));
    });

    // Lecteur modal : vidéo auto-hébergée, focus piégé et rendu au déclencheur.
    const modal = document.querySelector('.tuto-modal');
    const holder = modal?.querySelector('.tuto-player');
    const youtubeLink = modal?.querySelector('.tuto-open-yt');
    const closeButton = modal?.querySelector('.tuto-close');
    let returnFocusTo = null;
    let previousBodyOverflow = '';

    function focusableModalElements() {
      if (!modal) return [];
      return [...modal.querySelectorAll(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
      )].filter(element => !element.hidden && element.getClientRects().length > 0);
    }

    function openVideo(videoId, listId, trigger) {
      if (!modal || !holder || !videoId) return;
      const safeVideoId = encodeURIComponent(videoId);
      const safeListId = encodeURIComponent(listId || '');
      returnFocusTo = trigger instanceof HTMLElement ? trigger : document.activeElement;
      holder.innerHTML = '';

      const video = document.createElement('video');
      video.src = `assets/tutos/${safeVideoId}.mp4`;
      video.poster = `https://i.ytimg.com/vi/${safeVideoId}/hqdefault.jpg`;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('controlsList', 'nodownload');
      video.onerror = () => {
        const url = `https://www.youtube.com/watch?v=${safeVideoId}&list=${safeListId}`;
        const fallback = "Vidéo indisponible ici — <a href='__URL__' target='_blank' rel='noopener'>regarder sur YouTube</a>.";
        const message = (window.i18nT ? window.i18nT('tu_err') : fallback).replace('__URL__', url);
        holder.innerHTML = `<p class="tuto-error">${message}</p>`;
      };
      holder.appendChild(video);

      if (youtubeLink) {
        youtubeLink.href = `https://www.youtube.com/watch?v=${safeVideoId}&list=${safeListId}`;
      }
      modal.hidden = false;
      modalOpen = true;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      restartTutorialAutoplay();
      window.requestAnimationFrame(() => (closeButton || modal).focus());
    }

    function closeVideo() {
      if (!modal || !modalOpen) return;
      modal.hidden = true;
      modalOpen = false;
      if (holder) holder.innerHTML = ''; // Retirer la vidéo stoppe la lecture.
      document.body.style.overflow = previousBodyOverflow;
      const focusTarget = returnFocusTo;
      returnFocusTo = null;
      if (focusTarget && focusTarget.isConnected && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      }
      restartTutorialAutoplay();
    }

    if (modal) {
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.tabIndex = -1;
      tutorials.querySelectorAll('.tuto-card').forEach(card => {
        card.addEventListener('click', () => openVideo(card.dataset.video, card.dataset.list, card));
      });
      modal.addEventListener('click', event => {
        const target = event.target;
        if (target === modal || (target instanceof Element && target.closest('.tuto-close'))) {
          closeVideo();
        }
      });
      modal.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeVideo();
          return;
        }
        if (event.key !== 'Tab') return;

        const focusable = focusableModalElements();
        if (!focusable.length) {
          event.preventDefault();
          modal.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }

    window.addEventListener('pagehide', () => window.clearTimeout(tutorialTimer), { once: true });
    window.addEventListener('pageshow', restartTutorialAutoplay);
    scheduleCoverflow();
    restartTutorialAutoplay();
  }
})();

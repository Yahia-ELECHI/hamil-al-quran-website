/* ===============================================
   🚀 HAMIL AL-QURAN WEBSITE - MAIN JAVASCRIPT
   ===============================================
   Fonctionnalités principales du site web
   =============================================== */

// Initialisation principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site Hamil Al-Quran loaded successfully');
    
    // Initialiser tous les composants
    initNavbar();
    initScrollAnimations();
    initLanguageSelector();
    initDownloadButtons();
    
    // Initialiser la langue par défaut en anglais
    changeLanguage('en');
    
    // Initialiser Swiper après un délai pour s'assurer que la library est chargée
    setTimeout(() => {
        initializeSwiper();
        initializePhoneSwiper();
    }, 500);
    
    // Animer le chargement initial
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

/* ===== NAVIGATION ===== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect - with null check
    window.addEventListener('scroll', function() {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle - with null checks
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links - with null checks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les éléments animés
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Compteurs animés pour les statistiques
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.textContent);
                let currentValue = 0;
                const increment = targetValue / 60; // Animation sur 1 seconde (60fps)
                
                const updateCounter = () => {
                    if (currentValue < targetValue) {
                        currentValue += increment;
                        counter.textContent = Math.ceil(currentValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = targetValue;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 70;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/* ===== LANGUAGE SELECTOR ===== */
function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Change language
            changeLanguage(selectedLang);
        });
    });
}

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.dataset.i18n;
        const translation = getTranslation(key, lang);
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update document language and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    console.log(`🌐 Language changed to: ${lang}`);
}

/* ===== DOWNLOAD BUTTONS ===== */
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.platform;
            
            // Analytics tracking (si Google Analytics est configuré)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_click', {
                    'platform': platform,
                    'app_name': 'hamil_al_quran'
                });
            }
            
            // Redirection vers les stores appropriés
            redirectToStore(platform);
        });
    });
}

function redirectToStore(platform) {
    const storeUrls = {
        'android': 'https://play.google.com/store/apps/details?id=com.tajweed.quran_tajweed&pcampaignid=web_share',
        'ios': 'https://apps.apple.com/us/app/%D8%AD-%D8%A7%D9%85-%D9%84-%D8%A7%D9%84-%D9%82-%D8%B1-%D8%A2%D9%86/id6749209998',
        'windows': 'https://github.com/Yahia-ELECHI/hamil-al-quran-website/releases/latest/download/HamilAlQuran_Setup_2.0.3.exe'
    };
    
    const url = storeUrls[platform];
    
    if (url) {
        if (platform === 'windows') {
            // Téléchargement direct pour Windows (évite le blocage popup)
            window.location.href = url;
        } else {
            // Ouvrir les stores dans un nouvel onglet
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (!newWindow) {
                window.location.href = url;
            }
        }
        console.log(`🚀 Redirecting to ${platform} store: ${url}`);
    } else {
        console.error(`Platform not supported: ${platform}`);
    }
}

/* ===== SWIPER CARROUSEL INITIALIZATION ===== */
function initializeSwiper() {
    // Vérifier que Swiper est disponible
    if (typeof Swiper === 'undefined') {
        console.warn('⚠️ Swiper library not loaded, skipping carousel initialization');
        return;
    }
    
    // Vérifier que l'élément existe
    const swiperElement = document.querySelector('.screenshots-swiper');
    if (!swiperElement) {
        console.warn('⚠️ Screenshots swiper element not found');
        return;
    }
    
    try {
        const swiper = new Swiper('.screenshots-swiper', {
        // Configuration générale
        loop: true,
        centeredSlides: true,
        spaceBetween: 30,
        
        // Auto-play
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        
        // Effets de transition
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
        },
        
        // Navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Support tactile
        touchRatio: 1,
        touchAngle: 45,
        
        // Navigation clavier
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        
        // Responsive breakpoints
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
        },
        
        // Callbacks
        on: {
            init: function () {
                console.log('🎠 Swiper carrousel initialized successfully');
            },
            slideChange: function () {
                console.log(`📱 Slide changed to: ${this.activeIndex + 1}`);
            },
        },
    });
    
    // Pause auto-play au survol
    const swiperContainer = document.querySelector('.screenshots-swiper');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => {
            swiper.autoplay.stop();
        });
        
        swiperContainer.addEventListener('mouseleave', () => {
            swiper.autoplay.start();
        });
    }
    
    return swiper;
    } catch (error) {
        console.error('❌ Error initializing Swiper carousel:', error);
        return null;
    }
}

/* ===== PHONE MOCKUP SWIPER INITIALIZATION ===== */
function initializePhoneSwiper() {
    // Vérifier que Swiper est disponible
    if (typeof Swiper === 'undefined') {
        console.warn('⚠️ Swiper library not loaded, skipping phone mockup initialization');
        return;
    }
    
    // Vérifier que l'élément existe
    const phoneSwiperElement = document.querySelector('.phone-swiper');
    if (!phoneSwiperElement) {
        console.warn('⚠️ Phone swiper element not found');
        return;
    }
    
    try {
        const phoneSwiper = new Swiper('.phone-swiper', {
        // Configuration générale
        loop: true,
        direction: 'vertical',
        
        // Auto-play plus rapide pour la démo
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        
        // Effets de transition fluides
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        
        // Pas de navigation manuelle (auto uniquement)
        allowTouchMove: false,
        
        // Callbacks
        on: {
            init: function () {
                console.log('📱 Phone mockup swiper initialized successfully');
            },
            slideChange: function () {
                console.log(`📱 Phone slide changed to: ${this.activeIndex + 1}`);
            },
        },
    });
    
    // Pause auto-play au survol de la section hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            phoneSwiper.autoplay.stop();
        });
        
        heroSection.addEventListener('mouseleave', () => {
            phoneSwiper.autoplay.start();
        });
    }
    
    return phoneSwiper;
    } catch (error) {
        console.error('❌ Error initializing phone mockup Swiper:', error);
        return null;
    }
}

/* ===== UTILITIES ===== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function trackPerformance() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`⚡ Page load time: ${loadTime}ms`);
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'value': loadTime,
                    'custom_parameter': 'hamil_al_quran_website'
                });
            }
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript error:', e.error);
    
    // Optional: Send to error tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

// Initialize performance tracking
trackPerformance();

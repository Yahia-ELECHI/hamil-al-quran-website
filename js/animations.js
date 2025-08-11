/* ===============================================
   ✨ ANIMATIONS LIBRARY
   ===============================================
   Animations fidèles au style de l'application
   =============================================== */

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.initializeCustomAnimations();
        
        console.log('✨ Animation manager initialized');
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);
        
        // Observer tous les éléments animés
        const animatableElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-bounce');
        animatableElements.forEach(el => {
            scrollObserver.observe(el);
        });
        
        this.observers.set('scroll', scrollObserver);
    }
    
    triggerAnimation(element) {
        const animationType = this.getAnimationType(element);
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            // Animations spécifiques selon le type
            switch(animationType) {
                case 'fade-up':
                    this.animateFadeUp(element);
                    break;
                case 'fade-left':
                    this.animateFadeLeft(element);
                    break;
                case 'bounce':
                    this.animateBounce(element);
                    break;
            }
        }, delay);
    }
    
    getAnimationType(element) {
        if (element.classList.contains('animate-fade-up')) return 'fade-up';
        if (element.classList.contains('animate-fade-left')) return 'fade-left';
        if (element.classList.contains('animate-bounce')) return 'bounce';
        return 'fade-up'; // default
    }
    
    animateFadeUp(element) {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    animateFadeLeft(element) {
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    animateBounce(element) {
        element.style.animation = 'bounce 2s infinite';
    }
    
    setupHoverAnimations() {
        // Animation des cartes features
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            this.setupCardHover(card);
        });
        
        // Animation des boutons
        const buttons = document.querySelectorAll('.btn, .download-btn');
        buttons.forEach(btn => {
            this.setupButtonHover(btn);
        });
        
        // Animation du logo principal
        const heroLogo = document.querySelector('.app-icon');
        if (heroLogo) {
            this.setupLogoAnimations(heroLogo);
        }
    }
    
    setupCardHover(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    }
    
    setupButtonHover(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.transition = 'all 0.2s ease';
            
            // Effet de brillance
            this.addShineEffect(button);
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
        
        // Animation au clic
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1)';
        });
    }
    
    setupLogoAnimations(logo) {
        let animationInterval;
        
        // Animation de pulse périodique
        const startPulseAnimation = () => {
            animationInterval = setInterval(() => {
                logo.style.animation = 'pulse 2s ease-in-out';
                
                setTimeout(() => {
                    logo.style.animation = '';
                }, 2000);
            }, 8000);
        };
        
        // Démarrer après un délai
        setTimeout(startPulseAnimation, 3000);
        
        // Animation au hover
        logo.addEventListener('mouseenter', () => {
            clearInterval(animationInterval);
            logo.style.transform = 'scale(1.05) rotate(5deg)';
            logo.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
            startPulseAnimation();
        });
    }
    
    addShineEffect(element) {
        // Créer l'effet de brillance qui traverse l'élément
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shine);
        
        // Déclencher l'animation
        setTimeout(() => {
            shine.style.left = '100%';
        }, 50);
        
        // Nettoyer après l'animation
        setTimeout(() => {
            if (shine.parentNode) {
                shine.parentNode.removeChild(shine);
            }
        }, 700);
    }
    
    initializeCustomAnimations() {
        // Animation des statistiques avec compteurs
        this.setupCounterAnimations();
        
        // Animation du téléphone mockup
        this.setupPhoneAnimation();
        
        // Parallax subtil pour l'arrière-plan
        this.setupParallaxEffect();
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(counter) {
        const finalValue = parseInt(counter.textContent);
        const duration = 2000; // 2 secondes
        const steps = 60;
        const stepValue = finalValue / steps;
        const stepDuration = duration / steps;
        
        let currentValue = 0;
        counter.textContent = '0';
        
        const timer = setInterval(() => {
            currentValue += stepValue;
            if (currentValue >= finalValue) {
                counter.textContent = finalValue;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(currentValue);
            }
        }, stepDuration);
        
        // Effet de surbrillance pendant l'animation
        counter.style.color = '#FFD700';
        counter.style.transition = 'color 0.3s ease';
        
        setTimeout(() => {
            counter.style.color = '';
        }, duration + 500);
    }
    
    setupPhoneAnimation() {
        const phoneMockup = document.querySelector('.phone-mockup');
        if (!phoneMockup) return;
        
        // Animation de flottement
        let floatDirection = 1;
        const animateFloat = () => {
            phoneMockup.style.transform = `rotate(-5deg) translateY(${floatDirection * 10}px)`;
            phoneMockup.style.transition = 'transform 3s ease-in-out';
            floatDirection *= -1;
        };
        
        // Démarrer l'animation
        setInterval(animateFloat, 3000);
        
        // Effet de parallax supprimé - la maquette reste simplement flottante
    }
    
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.pattern-overlay');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Méthode publique pour déclencher des animations personnalisées
    triggerCustomAnimation(element, animationType, options = {}) {
        const defaults = {
            duration: 300,
            easing: 'ease-out',
            delay: 0
        };
        
        const config = Object.assign(defaults, options);
        
        setTimeout(() => {
            switch(animationType) {
                case 'bounceIn':
                    this.bounceIn(element, config);
                    break;
                case 'slideIn':
                    this.slideIn(element, config);
                    break;
                case 'fadeIn':
                    this.fadeIn(element, config);
                    break;
                default:
                    console.warn(`Unknown animation type: ${animationType}`);
            }
        }, config.delay);
    }
    
    bounceIn(element, config) {
        element.style.animation = `bounceIn ${config.duration}ms ${config.easing}`;
    }
    
    slideIn(element, config) {
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
        element.style.transition = `all ${config.duration}ms ${config.easing}`;
    }
    
    fadeIn(element, config) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${config.duration}ms ${config.easing}`;
    }
    
    // Nettoyage
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// CSS keyframes additionnels créés dynamiquement
const additionalKeyframes = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideInRight {
        0% {
            opacity: 0;
            transform: translateX(100px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }
    }
`;

// Injecter les keyframes CSS
const style = document.createElement('style');
style.textContent = additionalKeyframes;
document.head.appendChild(style);

// Initialiser le gestionnaire d'animations
let animationManager;

document.addEventListener('DOMContentLoaded', function() {
    animationManager = new AnimationManager();
});

// Nettoyage lors du déchargement de la page
window.addEventListener('beforeunload', function() {
    if (animationManager) {
        animationManager.destroy();
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}

/**
 * EmailJS Configuration Loader
 * Hamil Al-Quran Website
 * Secure configuration management for EmailJS
 */

// Configuration EmailJS - sécurisée pour production
window.EMAILJS_CONFIG = {
    // Variables d'environnement Cloudflare Pages (production)
    // Sinon valeurs locales pour développement
    serviceId: typeof EMAILJS_SERVICE_ID !== 'undefined' ? EMAILJS_SERVICE_ID : 'service_wkk110j',
    templateId: typeof EMAILJS_TEMPLATE_ID !== 'undefined' ? EMAILJS_TEMPLATE_ID : 'template_twpnd3j',
    publicKey: typeof EMAILJS_PUBLIC_KEY !== 'undefined' ? EMAILJS_PUBLIC_KEY : 'AFEbB7rRqpRJFDIdt'
};

/**
 * Vérifier si EmailJS est configuré avec de vraies clés
 * @returns {boolean} True si configuré, false sinon
 */
function isEmailJSConfigured() {
    const config = window.EMAILJS_CONFIG;
    return config.serviceId !== 'VOTRE_SERVICE_ID_ICI' &&
           config.templateId !== 'VOTRE_TEMPLATE_ID_ICI' &&
           config.publicKey !== 'VOTRE_PUBLIC_KEY_ICI' &&
           config.serviceId.trim() !== '' &&
           config.templateId.trim() !== '' &&
           config.publicKey.trim() !== '';
}

/**
 * Initialiser EmailJS avec la configuration
 */
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && isEmailJSConfigured()) {
        try {
            emailjs.init(window.EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ EmailJS initialization failed:', error);
            return false;
        }
    } else if (!isEmailJSConfigured()) {
        console.warn('⚠️ EmailJS not configured. Please update emailjs-config.js with your keys.');
        return false;
    }
    return false;
}

// Initialiser EmailJS automatiquement quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Petit délai pour s'assurer que emailjs est chargé
    setTimeout(initializeEmailJS, 100);
});

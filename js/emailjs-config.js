/**
 * EmailJS Configuration Loader
 * Hamil Al-Quran Website
 * Secure configuration management for EmailJS
 */

// Configuration EmailJS - sera chargée de manière sécurisée
window.EMAILJS_CONFIG = {
    // INSTRUCTIONS : Remplacez ces valeurs par vos vraies clés EmailJS
    // Après avoir créé votre compte sur https://www.emailjs.com/
    
    // 1. SERVICE ID : Obtenu après avoir connecté votre Gmail
    serviceId: 'VOTRE_SERVICE_ID_ICI',
    
    // 2. TEMPLATE ID : Créé pour le formulaire de contact  
    templateId: 'VOTRE_TEMPLATE_ID_ICI',
    
    // 3. PUBLIC KEY : Clé publique de votre compte EmailJS
    publicKey: 'VOTRE_PUBLIC_KEY_ICI'
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

/**
 * Contact Form Handler with EmailJS
 * Hamil Al-Quran Website
 * Professional email integration for contact forms
 */

// EmailJS Configuration - TO BE CONFIGURED
const EMAILJS_CONFIG = {
    serviceId: 'service_hamil_quran', // À remplacer par votre Service ID
    templateId: 'template_contact_form', // À remplacer par votre Template ID  
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // À remplacer par votre clé publique EmailJS
};

// Vérifier la configuration avant utilisation
function isEmailJSConfigured() {
    return EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
           EMAILJS_CONFIG.serviceId !== 'service_hamil_quran' &&
           EMAILJS_CONFIG.templateId !== 'template_contact_form';
}

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const messageTextarea = document.getElementById('message');
    const messageCounter = document.getElementById('message-count');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
        
        // Real-time validation
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    // Character counter for message
    if (messageTextarea && messageCounter) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            messageCounter.textContent = currentLength;
            
            if (currentLength > 1000) {
                messageCounter.style.color = '#ef4444';
            } else if (currentLength > 800) {
                messageCounter.style.color = '#f59e0b';
            } else {
                messageCounter.style.color = '#6b7280';
            }
        });
    }
});

/**
 * Handle form submission
 * @param {HTMLFormElement} form - The contact form element
 */
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Vérifier la configuration EmailJS
    if (!isEmailJSConfigured()) {
        showErrorMessage('Configuration EmailJS requise. Consultez EMAILJS_SETUP.md pour configurer le service.');
        return;
    }
    
    // Show loading state
    setLoadingState(submitButton, true);
    
    // Get form data
    const formData = {
        from_name: form.name.value,
        from_email: form.email.value,
        subject: getSubjectText(form.subject.value),
        message: form.message.value,
        to_email: 'contact@hamil-al-quran.com',
        timestamp: new Date().toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Send email via EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showSuccessMessage();
            form.reset();
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            showErrorMessage();
        })
        .finally(function() {
            setLoadingState(submitButton, false, originalButtonText);
        });
}

/**
 * Convert subject value to readable text
 * @param {string} value - Subject value from form
 * @returns {string} Human readable subject
 */
function getSubjectText(value) {
    const subjects = {
        'support': 'Support Technique',
        'suggestion': 'Suggestion',
        'bug': 'Signalement de Bug',
        'other': 'Autre'
    };
    return subjects[value] || value;
}

/**
 * Set loading state for submit button
 * @param {HTMLButtonElement} button - Submit button element
 * @param {boolean} isLoading - Loading state
 * @param {string} originalText - Original button text
 */
function setLoadingState(button, isLoading, originalText = '') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            ${getCurrentLanguage() === 'ar' ? 'جاري الإرسال...' : 
              getCurrentLanguage() === 'en' ? 'Sending...' : 'Envoi en cours...'}
        `;
    } else {
        button.disabled = false;
        button.innerHTML = originalText || `
            <i class="fas fa-paper-plane"></i>
            ${getCurrentLanguage() === 'ar' ? 'إرسال الرسالة' : 
              getCurrentLanguage() === 'en' ? 'Send message' : 'Envoyer le message'}
        `;
    }
}

/**
 * Show success message
 */
function showSuccessMessage() {
    const message = getCurrentLanguage() === 'ar' ? 
        'تم إرسال رسالتك بنجاح! سنرد عليك قريباً إن شاء الله.' :
        getCurrentLanguage() === 'en' ? 
        'Your message has been sent successfully! We will respond to you soon.' :
        'Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.';
    
    showNotification(message, 'success');
}

/**
 * Show error message
 */
function showErrorMessage() {
    const message = getCurrentLanguage() === 'ar' ? 
        'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل مباشرة عبر البريد الإلكتروني.' :
        getCurrentLanguage() === 'en' ? 
        'An error occurred while sending the message. Please try again or contact us directly via email.' :
        'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement par email.';
    
    showNotification(message, 'error');
}

/**
 * Show notification message
 * @param {string} message - Message to show
 * @param {string} type - Notification type (success, error)
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification to page
    const contactForm = document.querySelector('.contact-form');
    contactForm.parentElement.insertBefore(notification, contactForm);
    
    // Auto-remove notification after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
    
    // Scroll to notification
    notification.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} Form validity
 */
function validateForm(form) {
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];
    
    fields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Field to validate
 * @returns {boolean} Field validity
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (!value) {
        errorMessage = getValidationMessage(fieldName, 'required');
        isValid = false;
    } else {
        // Specific field validations
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = getValidationMessage('name', 'minlength');
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = getValidationMessage('name', 'maxlength');
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = getValidationMessage('email', 'invalid');
                    isValid = false;
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    errorMessage = getValidationMessage('message', 'minlength');
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = getValidationMessage('message', 'maxlength');
                    isValid = false;
                }
                break;
        }
    }
    
    // Display error or clear it
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Show field error
 * @param {HTMLElement} field - Field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.classList.add('error');
}

/**
 * Clear field error
 * @param {HTMLElement} field - Field element
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
}

/**
 * Get validation message based on field and error type
 * @param {string} fieldName - Name of the field
 * @param {string} errorType - Type of error
 * @returns {string} Localized error message
 */
function getValidationMessage(fieldName, errorType) {
    const lang = getCurrentLanguage();
    const messages = {
        'fr': {
            'name': {
                'required': 'Le nom est requis',
                'minlength': 'Le nom doit contenir au moins 2 caractères',
                'maxlength': 'Le nom ne peut pas dépasser 50 caractères'
            },
            'email': {
                'required': 'L\'adresse email est requise',
                'invalid': 'Veuillez saisir une adresse email valide'
            },
            'subject': {
                'required': 'Veuillez sélectionner un sujet'
            },
            'message': {
                'required': 'Le message est requis',
                'minlength': 'Le message doit contenir au moins 10 caractères',
                'maxlength': 'Le message ne peut pas dépasser 1000 caractères'
            }
        },
        'en': {
            'name': {
                'required': 'Name is required',
                'minlength': 'Name must be at least 2 characters',
                'maxlength': 'Name cannot exceed 50 characters'
            },
            'email': {
                'required': 'Email address is required',
                'invalid': 'Please enter a valid email address'
            },
            'subject': {
                'required': 'Please select a subject'
            },
            'message': {
                'required': 'Message is required',
                'minlength': 'Message must be at least 10 characters',
                'maxlength': 'Message cannot exceed 1000 characters'
            }
        },
        'ar': {
            'name': {
                'required': 'الاسم مطلوب',
                'minlength': 'يجب أن يحتوي الاسم على حرفين على الأقل',
                'maxlength': 'لا يمكن أن يتجاوز الاسم 50 حرفاً'
            },
            'email': {
                'required': 'عنوان البريد الإلكتروني مطلوب',
                'invalid': 'يرجى إدخال عنوان بريد إلكتروني صحيح'
            },
            'subject': {
                'required': 'يرجى اختيار موضوع'
            },
            'message': {
                'required': 'الرسالة مطلوبة',
                'minlength': 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل',
                'maxlength': 'لا يمكن أن تتجاوز الرسالة 1000 حرف'
            }
        }
    };
    
    return messages[lang]?.[fieldName]?.[errorType] || messages['fr'][fieldName][errorType];
}

/**
 * Get current language from i18n system
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return document.documentElement.lang || 'fr';
}

// CSS for notifications and form enhancements (injected dynamically)
const notificationStyles = `
<style>
/* Notification Styles */
.form-notification {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.3s ease-out;
}

.form-notification.success {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
}

.form-notification.error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    gap: 12px;
}

.notification-content i:first-child {
    font-size: 20px;
    flex-shrink: 0;
}

.notification-content span {
    flex: 1;
    line-height: 1.5;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    flex-shrink: 0;
}

.notification-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

/* Form Validation Styles */
.field-error {
    display: none;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 4px;
    font-weight: 500;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.form-group input.error:focus,
.form-group select.error:focus,
.form-group textarea.error:focus {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
}

/* Character Counter */
.character-count {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
    font-size: 0.875rem;
    color: #6b7280;
}

#message-count {
    font-weight: 500;
}

/* Enhanced Form Placeholders */
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #9ca3af;
    opacity: 0.8;
}

/* Loading Button Animation */
.btn.loading {
    position: relative;
    color: transparent !important;
}

.btn.loading::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    color: white;
}

/* Responsive Form Enhancements */
@media (max-width: 768px) {
    .field-error {
        font-size: 0.813rem;
    }
    
    .character-count {
        font-size: 0.813rem;
    }
}

/* Animation Keyframes */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Form Focus Enhancements */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
}

/* Success State */
.form-group input.success,
.form-group select.success,
.form-group textarea.success {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);

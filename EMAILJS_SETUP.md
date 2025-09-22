# Configuration EmailJS pour le Formulaire de Contact

## 📧 ÉTAPES DE CONFIGURATION EMAILJS

### 1. Créer un compte EmailJS
1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit (limite : 200 emails/mois)
3. Vérifiez votre adresse email

### 2. Configurer le Service Email
1. Dans le dashboard EmailJS, cliquez sur "Add New Service"
2. Sélectionnez "Gmail" 
3. Connectez votre compte Gmail (contact@hamil-al-quran.com)
4. Notez le **Service ID** généré (ex: `service_hamil_quran`)

### 3. Créer le Template Email
1. Cliquez sur "Email Templates" → "Create New Template"
2. Utilisez ce template :

```html
Subject: [Hamil Al-Quran] {{subject}} - Message de {{from_name}}

Bonjour,

Vous avez reçu un nouveau message via le formulaire de contact du site Hamil Al-Quran :

**Expéditeur:** {{from_name}}
**Email:** {{from_email}}
**Sujet:** {{subject}}
**Date:** {{timestamp}}

**Message:**
{{message}}

---
Ce message a été envoyé automatiquement depuis le site hamil-al-quran.com
```

3. Configurez les variables :
   - `from_name` : Nom de l'expéditeur
   - `from_email` : Email de l'expéditeur  
   - `subject` : Sujet du message
   - `message` : Contenu du message
   - `timestamp` : Date et heure d'envoi

4. Notez le **Template ID** généré (ex: `template_contact_form`)

### 4. Obtenir la clé publique
1. Allez dans "Account" → "General"
2. Copiez votre **Public Key** (ex: `abcd1234`)

### 5. Mettre à jour le code JavaScript
Dans le fichier `js/contact-form.js`, remplacez :

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'VOTRE_SERVICE_ID',
    templateId: 'VOTRE_TEMPLATE_ID', 
    publicKey: 'VOTRE_CLE_PUBLIQUE'
};
```

### 6. Configuration Gmail avancée
Pour une meilleure sécurité, configurez :
1. **Auto-Reply** : Réponse automatique de confirmation
2. **Filters** : Filtrage des emails du formulaire
3. **Labels** : Organisation des messages reçus

## 🔒 SÉCURITÉ ET BONNES PRATIQUES

- ✅ La clé publique EmailJS peut être visible côté client
- ✅ Limitez les domaines autorisés dans EmailJS dashboard
- ✅ Activez les restrictions d'origine (Origin restrictions)
- ✅ Surveillez votre quota d'emails mensuel

## 📊 CONFIGURATION RECOMMANDÉE

**Paramètres EmailJS Dashboard :**
- **Allowed Origins:** `hamil-al-quran.com`, `localhost`
- **Auto-Reply:** Activé avec message de confirmation
- **Monthly Quota:** Alertes à 80% du quota

**Template d'auto-réponse :**
```html
Subject: Confirmation - Votre message a été reçu

Bonjour {{from_name}},

Merci pour votre message concernant "{{subject}}".

Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.

Cordialement,
L'équipe Hamil Al-Quran
contact@hamil-al-quran.com
```

## 🚀 MISE EN PRODUCTION

1. Testez le formulaire en local
2. Configurez les domaines autorisés  
3. Activez les restrictions de sécurité
4. Déployez sur Cloudflare Pages
5. Testez sur le domaine de production

Une fois configuré, le formulaire enverra automatiquement les messages vers votre Gmail professionnel !

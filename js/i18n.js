/* ===============================================
   🌐 INTERNATIONALIZATION (I18N)
   ===============================================
   Traductions pour le site web Hamil Al-Quran
   =============================================== */

const translations = {
    fr: {
        // Navigation
        'nav-home': 'Accueil',
        'nav-features': 'Fonctionnalités',
        'nav-screenshots': 'Captures',
        'nav-download': 'Télécharger',
        'nav-support': 'Support',
        'nav-privacy': 'Confidentialité',

        // Hero Section
        'hero-subtitle': 'Application moderne d\'apprentissage et de révision du Coran',
        'hero-description': 'Une expérience d\'apprentissage complète avec système d\'erreurs Tajweed, objectifs personnalisés, enregistrements audio et suivi de progression avancé.',
        'hero-quote': '"عن عثمان بن عفان رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"',
        'hero-quote-translation': '"Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne"',
        'hero-quote-reference': 'Hadith rapporté par Al-Bukhārī (5027) - Sanad : ʿUthmān ibn ʿAffān (رضي الله عنه) - Classé Ṣaḥīḥ',
        'btn-download': 'Télécharger',
        'btn-discover': 'Découvrir',
        'scroll-hint': 'Découvrir',

        // Stats
        'stat-users': 'Utilisateurs actifs',
        'stat-satisfaction': 'Satisfaction',
        'stat-rating': '★ Note moyenne',
        'stat-hours': 'Heures d\'apprentissage',

        // Features
        'features-title': 'Fonctionnalités Principales',
        'features-description': 'Une suite complète d\'outils pour l\'apprentissage et la révision du Coran',
        
        // Tutorials
        'tutorials-title': 'Tutoriels Vidéo',
        'tutorials-description': 'Découvrez comment utiliser l\'application avec nos tutoriels courts et pratiques',
        'tutorial-1-title': 'Première utilisation',
        'tutorial-1-desc': 'Apprenez les bases de l\'application',
        'tutorial-2-title': 'Système de révision',
        'tutorial-2-desc': 'Créez vos objectifs de révision',
        'tutorial-3-title': 'Détection d\'erreurs Tajweed',
        'tutorial-3-desc': 'Utilisez le système d\'analyse audio',
        
        // Privacy
        'privacy-title': 'Confidentialité et Sécurité',
        'privacy-description': 'Votre confidentialité est notre priorité. Découvrez comment nous protégeons vos données.',
        'privacy-no-account-title': 'Sans Compte Utilisateur',
        'privacy-no-account-desc': 'Aucune inscription requise, utilisez l\'application immédiatement sans partager d\'informations',
        'privacy-anonymous-title': 'Utilisation Anonyme',
        'privacy-anonymous-desc': 'Aucune donnée personnelle n\'est collectée ou partagée avec des tiers',
        'privacy-local-title': 'Stockage Local',
        'privacy-local-desc': 'Vos progrès et objectifs restent sur votre appareil uniquement',
        'privacy-no-tracking-title': 'Aucun Tracking',
        'privacy-no-tracking-desc': 'Pas de publicité, pas de suivi comportemental, pas d\'analytics invasifs',
        'privacy-audio-title': 'Enregistrements Privés',
        'privacy-audio-desc': 'Vos récitations audio restent sur votre appareil, jamais envoyées vers des serveurs',
        'privacy-offline-title': 'Mode Hors-ligne',
        'privacy-offline-desc': 'Fonctionnement complet sans connexion internet, protection totale de la vie privée',
        'privacy-policy-btn': 'Lire la Politique Complète',
        
        'feature-mushaf-title': 'Mushaf Interactif',
        'feature-mushaf-desc': 'Naviguez dans le Coran avec 6 riwaya différentes (Hafs, Warsh, Al-Bazzi, etc.) en haute qualité avec interface tactile intuitive.',
        
        'feature-audio-title': 'Enregistrements Audio',
        'feature-audio-desc': 'Enregistrez votre récitation avec le système Tasmi3, écoutez vos progrès et partagez avec votre enseignant.',
        
        'feature-tajweed-title': 'Erreurs Tajweed',
        'feature-tajweed-desc': 'Système avancé de marquage des erreurs avec 12+ types d\'erreurs Tajweed, commentaires et statistiques détaillées.',
        
        'feature-objectives-title': 'Objectifs Personnalisés',
        'feature-objectives-desc': 'Définissez vos objectifs mensuels et annuels, suivez votre progression avec des statistiques visuelles.',
        
        'feature-tekrar-title': 'Système Tekrar',
        'feature-tekrar-desc': 'Créez des compteurs de répétition pour sourates, pages ou versets avec suivi automatique de progression.',
        
        'feature-stats-title': 'Statistiques Avancées',
        'feature-stats-desc': 'Visualisez vos progrès avec graphiques détaillés, jours consécutifs et analyse des erreurs par sourate.',

        // Screenshots
        'screenshots-title': 'Captures d\'Écran',
        'screenshots-description': 'Découvrez l\'interface moderne et intuitive de l\'application',
        'screenshot-home': 'Écran d\'accueil',
        'screenshot-mushaf': 'Interface Mushaf',
        'screenshot-revision': 'Système de révision',
        'screenshot-audio': 'Enregistrements audio',
        'screenshot-profiles': 'Gestion des profils',
        'screenshot-stats': 'Statistiques détaillées',
        'screenshot-objectives': 'Objectifs personnalisés',
        'screenshot-navigation': 'Navigation Mushaf',

        // Download
        'download-title': 'Télécharger l\'Application',
        'download-description': 'Disponible gratuitement sur toutes les plateformes',
        'download-on': 'Disponible sur',
        'download-for': 'Pour',
        'download-secure': '100% Sécurisé',
        'download-free': 'Entièrement Gratuit',
        'download-multilang': 'Multilingue',

        // Footer
        'footer-description': 'Application moderne d\'apprentissage et de révision du Coran avec fonctionnalités avancées pour tous les niveaux.',
        'footer-links': 'Liens Utiles',
        'footer-guide': 'Guide Utilisateur',
        'footer-privacy': 'Confidentialité',
        'footer-support': 'Support',
        'footer-contact': 'Contact',
        'footer-faq': 'FAQ',
        'footer-about': 'À propos',
        'footer-follow': 'Nous Suivre',
        'footer-copyright': '© 2025 حَامِلُ الْقُرْآنْ - Hamil Al-Quran. Tous droits réservés.',
        
        // Common
        'back-to-home': 'Retour à l\'accueil',
        
        // Contact page
        'contact-title': 'Contact',
        'contact-subtitle': 'Nous sommes là pour vous aider. N\'hésitez pas à nous contacter.',
        'contact-email-title': 'Email',
        'contact-email-desc': 'Envoyez-nous un message et nous vous répondrons rapidement',
        'contact-support-title': 'Support Technique',
        'contact-support-desc': 'Besoin d\'aide avec l\'application ? Consultez notre FAQ ou contactez-nous',
        'contact-faq-link': 'Voir la FAQ',
        'contact-suggestions-title': 'Suggestions',
        'contact-suggestions-desc': 'Vous avez des idées pour améliorer l\'application ? Partagez-les avec nous',
        'contact-form-title': 'Envoyez-nous un message',
        'contact-form-name': 'Nom',
        'contact-form-email': 'Email',
        'contact-form-subject': 'Sujet',
        'contact-form-subject-select': 'Sélectionnez un sujet',
        'contact-form-subject-support': 'Support technique',
        'contact-form-subject-suggestion': 'Suggestion',
        'contact-form-subject-bug': 'Signalement de bug',
        'contact-form-subject-other': 'Autre',
        'contact-form-message': 'Message',
        'contact-form-send': 'Envoyer le message',
        
        // FAQ page
        'faq-title': 'Questions Fréquentes',
        'faq-subtitle': 'Trouvez rapidement les réponses aux questions les plus courantes sur l\'application.',
        'faq-cat-general': 'Général',
        'faq-cat-features': 'Fonctionnalités',
        'faq-cat-technical': 'Technique',
        'faq-cat-privacy': 'Confidentialité',
        'faq-q1': 'Qu\'est-ce que l\'application حَامِلُ الْقُرْآنْ ?',
        'faq-a1': 'حَامِلُ الْقُرْآنْ est une application moderne d\'apprentissage et de révision du Coran qui offre des fonctionnalités avancées pour mémoriser, réviser et améliorer sa récitation du Coran avec des outils d\'analyse Tajweed.',
        'faq-q2': 'L\'application est-elle gratuite ?',
        'faq-a2': 'Oui, l\'application est entièrement gratuite. Aucun abonnement ni achat intégré n\'est requis pour accéder à toutes les fonctionnalités.',
        'faq-q3': 'Sur quelles plateformes l\'application est-elle disponible ?',
        'faq-a3': 'L\'application est disponible sur Android et iOS. Vous pouvez la télécharger depuis Google Play Store et Apple App Store.',
        'faq-q4': 'Quelles riwaya sont disponibles ?',
        'faq-a4': 'L\'application propose 6 riwaya différentes incluant Hafs, Warsh, Al-Bazzi, et d\'autres lectures authentiques du Coran.',
        'faq-q5': 'Comment fonctionne la détection d\'erreurs Tajweed ?',
        'faq-a5': 'Le système analyse votre récitation et identifie plus de 12 types d\'erreurs Tajweed courantes, vous permettant d\'améliorer votre prononciation et votre récitation.',
        'faq-q6': 'Puis-je définir des objectifs personnalisés ?',
        'faq-a6': 'Oui, vous pouvez définir des objectifs mensuels et annuels, suivre votre progression avec des statistiques détaillées et visuelles.',
        'faq-q7': 'L\'application fonctionne-t-elle hors ligne ?',
        'faq-a7': 'Oui, toutes les fonctionnalités principales de l\'application fonctionnent sans connexion internet une fois téléchargée.',
        'faq-q8': 'Puis-je sauvegarder mes données ?',
        'faq-a8': 'Vos données sont automatiquement sauvegardées localement sur votre appareil. Aucune synchronisation cloud n\'est requise.',
        'faq-q9': 'Mes données personnelles sont-elles sécurisées ?',
        'faq-a9': 'Aucune donnée personnelle n\'est collectée. Toutes vos informations restent stockées localement sur votre appareil.',
        'faq-q10': 'L\'application utilise-t-elle des trackers ?',
        'faq-a10': 'Non, l\'application ne contient aucun tracker, publicité ou analytics invasifs. Votre vie privée est respectée.',
        
        // About page
        'about-title': 'À propos de حَامِلُ الْقُرْآنْ',
        'about-subtitle': 'Découvrez notre mission et les valeurs qui guident le développement de cette application.',
        'about-mission-title': 'Notre Mission',
        'about-mission-desc': 'Créer une application moderne et accessible qui facilite l\'apprentissage, la mémorisation et la révision du Saint Coran pour tous les musulmans, quel que soit leur niveau.',
        'about-vision-title': 'Notre Vision',
        'about-vision-desc': 'Devenir l\'outil de référence pour l\'étude du Coran, en combinant tradition islamique et innovation technologique pour préserver et transmettre ce précieux héritage.',
        'about-values-title': 'Nos Valeurs',
        'about-value-respect-title': 'Respect',
        'about-value-respect-desc': 'Respect profond pour le texte sacré et les traditions d\'apprentissage islamiques.',
        'about-value-accessibility-title': 'Accessibilité',
        'about-value-accessibility-desc': 'Rendre l\'apprentissage du Coran accessible à tous, partout et à tout moment.',
        'about-value-privacy-title': 'Confidentialité',
        'about-value-privacy-desc': 'Protection totale de la vie privée avec stockage local et aucun tracking.',
        'about-value-innovation-title': 'Innovation',
        'about-value-innovation-desc': 'Utilisation des dernières technologies pour améliorer l\'expérience d\'apprentissage.',
        'about-value-free-title': 'Gratuit',
        'about-value-free-desc': 'Application entièrement gratuite sans publicité ni abonnement.',
        'about-value-universal-title': 'Universel',
        'about-value-universal-desc': 'Support multilingue pour une communauté musulmane globale et diverse.',
        'about-tech-title': 'Technologie',
        'about-tech-desc': 'L\'application est développée avec Flutter, garantissant une expérience native haute performance sur Android et iOS. Nous utilisons des algorithmes avancés d\'analyse audio pour la détection d\'erreurs Tajweed et des bases de données optimisées pour un accès rapide au contenu coranique.',
        'about-tech-database': 'Base de données locale',
        'about-tech-audio': 'Analyse audio avancée',
        'about-tech-native': 'Interface native',
        'about-contact-title': 'Nous Contacter',
        'about-contact-desc': 'Vous avez des questions, suggestions ou souhaitez contribuer au projet ? N\'hésitez pas à nous contacter.',
        'about-contact-btn': 'Nous Contacter',
        'about-faq-btn': 'Voir la FAQ'
    },

    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-screenshots': 'Screenshots',
        'nav-download': 'Download',
        'nav-support': 'Support',
        'nav-privacy': 'Privacy',

        // Hero Section
        'hero-subtitle': 'Modern Quran Learning and Revision Application',
        'hero-description': 'A complete learning experience with Tajweed error system, personalized objectives, audio recordings and advanced progress tracking.',
        'hero-quote': '"عن عثمان بن عفان رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"',
        'hero-quote-translation': '"The best of you are those who learn the Quran and teach it"',
        'hero-quote-reference': 'Hadith narrated by Al-Bukhārī (5027) - Chain: ʿUthmān ibn ʿAffān (رضي الله عنه) - Graded Ṣaḥīḥ',
        'btn-download': 'Download',
        'btn-discover': 'Discover',
        'scroll-hint': 'Explore',

        // Stats
        'stat-users': 'Active Users',
        'stat-satisfaction': 'Satisfaction',
        'stat-rating': '★ Average Rating',
        'stat-hours': 'Learning Hours',

        // Features
        'features-title': 'Main Features',
        'features-description': 'A complete suite of tools for Quran learning and revision',
        
        // Tutorials
        'tutorials-title': 'Video Tutorials',
        'tutorials-description': 'Learn how to use the application with our short and practical tutorials',
        'tutorial-1-title': 'First Steps',
        'tutorial-1-desc': 'Learn the basics of the application',
        'tutorial-2-title': 'Revision System',
        'tutorial-2-desc': 'Create your revision objectives',
        'tutorial-3-title': 'Tajweed Error Detection',
        'tutorial-3-desc': 'Use the audio analysis system',
        
        // Privacy
        'privacy-title': 'Privacy and Security',
        'privacy-description': 'Your privacy is our priority. Discover how we protect your data.',
        'privacy-no-account-title': 'No User Account',
        'privacy-no-account-desc': 'No registration required, use the app immediately without sharing information',
        'privacy-anonymous-title': 'Anonymous Usage',
        'privacy-anonymous-desc': 'No personal data is collected or shared with third parties',
        'privacy-local-title': 'Local Storage',
        'privacy-local-desc': 'Your progress and objectives remain on your device only',
        'privacy-no-tracking-title': 'No Tracking',
        'privacy-no-tracking-desc': 'No advertising, no behavioral tracking, no invasive analytics',
        'privacy-audio-title': 'Private Recordings',
        'privacy-audio-desc': 'Your audio recitations stay on your device, never sent to servers',
        'privacy-offline-title': 'Offline Mode',
        'privacy-offline-desc': 'Complete functionality without internet connection, total privacy protection',
        'privacy-policy-btn': 'Read Full Policy',
        
        'feature-mushaf-title': 'Interactive Mushaf',
        'feature-mushaf-desc': 'Navigate through the Quran with 6 different riwaya (Hafs, Warsh, Al-Bazzi, etc.) in high quality with intuitive touch interface.',
        
        'feature-audio-title': 'Audio Recordings',
        'feature-audio-desc': 'Record your recitation with Tasmi3 system, listen to your progress and share with your teacher.',
        
        'feature-tajweed-title': 'Tajweed Errors',
        'feature-tajweed-desc': 'Advanced error marking system with 12+ Tajweed error types, comments and detailed statistics.',
        
        'feature-objectives-title': 'Personal Objectives',
        'feature-objectives-desc': 'Set your monthly and yearly objectives, track your progress with visual statistics.',
        
        'feature-tekrar-title': 'Tekrar System',
        'feature-tekrar-desc': 'Create repetition counters for surahs, pages or verses with automatic progress tracking.',
        
        'feature-stats-title': 'Advanced Statistics',
        'feature-stats-desc': 'Visualize your progress with detailed charts, consecutive days and error analysis per surah.',

        // Screenshots
        'screenshots-title': 'Screenshots',
        'screenshots-description': 'Discover the modern and intuitive interface of the application',
        'screenshot-home': 'Home Screen',
        'screenshot-mushaf': 'Mushaf Interface',
        'screenshot-revision': 'Revision System',
        'screenshot-audio': 'Audio Recordings',
        'screenshot-profiles': 'Profile Management',
        'screenshot-stats': 'Detailed Statistics',
        'screenshot-objectives': 'Personal Objectives',
        'screenshot-navigation': 'Mushaf Navigation',

        // Download
        'download-title': 'Download the App',
        'download-description': 'Available for free on all platforms',
        'download-on': 'Available on',
        'download-for': 'For',
        'download-secure': '100% Secure',
        'download-free': 'Completely Free',
        'download-multilang': 'Multilingual',

        // Footer
        'footer-description': 'Modern Quran learning and revision application with advanced features for all levels.',
        'footer-links': 'Useful Links',
        'footer-guide': 'User Guide',
        'footer-privacy': 'Privacy',
        'footer-support': 'Support',
        'footer-contact': 'Contact',
        'footer-faq': 'FAQ',
        'footer-about': 'About',
        'footer-follow': 'Follow Us',
        'footer-copyright': '© 2025 حَامِلُ الْقُرْآنْ - Hamil Al-Quran. All rights reserved.',
        
        // Common
        'back-to-home': 'Back to Home',
        
        // Contact page
        'contact-title': 'Contact',
        'contact-subtitle': 'We are here to help you. Don\'t hesitate to contact us.',
        'contact-email-title': 'Email',
        'contact-email-desc': 'Send us a message and we will respond quickly',
        'contact-support-title': 'Technical Support',
        'contact-support-desc': 'Need help with the app? Check our FAQ or contact us',
        'contact-faq-link': 'View FAQ',
        'contact-suggestions-title': 'Suggestions',
        'contact-suggestions-desc': 'Have ideas to improve the app? Share them with us',
        'contact-form-title': 'Send us a message',
        'contact-form-name': 'Name',
        'contact-form-email': 'Email',
        'contact-form-subject': 'Subject',
        'contact-form-subject-select': 'Select a subject',
        'contact-form-subject-support': 'Technical support',
        'contact-form-subject-suggestion': 'Suggestion',
        'contact-form-subject-bug': 'Bug report',
        'contact-form-subject-other': 'Other',
        'contact-form-message': 'Message',
        'contact-form-send': 'Send message',
        
        // FAQ page
        'faq-title': 'Frequently Asked Questions',
        'faq-subtitle': 'Quickly find answers to the most common questions about the app.',
        'faq-cat-general': 'General',
        'faq-cat-features': 'Features',
        'faq-cat-technical': 'Technical',
        'faq-cat-privacy': 'Privacy',
        'faq-q1': 'What is the حَامِلُ الْقُرْآنْ app?',
        'faq-a1': 'حَامِلُ الْقُرْآنْ is a modern Quran learning and revision app that offers advanced features for memorizing, reviewing and improving Quran recitation with Tajweed analysis tools.',
        'faq-q2': 'Is the app free?',
        'faq-a2': 'Yes, the app is completely free. No subscription or in-app purchases are required to access all features.',
        'faq-q3': 'On which platforms is the app available?',
        'faq-a3': 'The app is available on Android and iOS. You can download it from Google Play Store and Apple App Store.',
        'faq-q4': 'What riwaya are available?',
        'faq-a4': 'The app offers 6 different riwaya including Hafs, Warsh, Al-Bazzi, and other authentic Quran readings.',
        'faq-q5': 'How does Tajweed error detection work?',
        'faq-a5': 'The system analyzes your recitation and identifies over 12 types of common Tajweed errors, allowing you to improve your pronunciation and recitation.',
        'faq-q6': 'Can I set personal goals?',
        'faq-a6': 'Yes, you can set monthly and annual goals, track your progress with detailed and visual statistics.',
        'faq-q7': 'Does the app work offline?',
        'faq-a7': 'Yes, all main features of the app work without internet connection once downloaded.',
        'faq-q8': 'Can I backup my data?',
        'faq-a8': 'Your data is automatically saved locally on your device. No cloud synchronization is required.',
        'faq-q9': 'Is my personal data secure?',
        'faq-a9': 'No personal data is collected. All your information remains stored locally on your device.',
        'faq-q10': 'Does the app use trackers?',
        'faq-a10': 'No, the app contains no trackers, ads or invasive analytics. Your privacy is respected.',
        
        // About page
        'about-title': 'About حَامِلُ الْقُرْآنْ',
        'about-subtitle': 'Discover our mission and the values that guide the development of this app.',
        'about-mission-title': 'Our Mission',
        'about-mission-desc': 'Create a modern and accessible app that facilitates learning, memorization and revision of the Holy Quran for all Muslims, regardless of their level.',
        'about-vision-title': 'Our Vision',
        'about-vision-desc': 'Become the reference tool for Quran study, combining Islamic tradition and technological innovation to preserve and transmit this precious heritage.',
        'about-values-title': 'Our Values',
        'about-value-respect-title': 'Respect',
        'about-value-respect-desc': 'Deep respect for the sacred text and Islamic learning traditions.',
        'about-value-accessibility-title': 'Accessibility',
        'about-value-accessibility-desc': 'Making Quran learning accessible to everyone, everywhere and anytime.',
        'about-value-privacy-title': 'Privacy',
        'about-value-privacy-desc': 'Total privacy protection with local storage and no tracking.',
        'about-value-innovation-title': 'Innovation',
        'about-value-innovation-desc': 'Using the latest technologies to improve the learning experience.',
        'about-value-free-title': 'Free',
        'about-value-free-desc': 'Completely free app with no ads or subscriptions.',
        'about-value-universal-title': 'Universal',
        'about-value-universal-desc': 'Multilingual support for a global and diverse Muslim community.',
        'about-tech-title': 'Technology',
        'about-tech-desc': 'The app is developed with Flutter, ensuring high-performance native experience on Android and iOS. We use advanced audio analysis algorithms for Tajweed error detection and optimized databases for fast access to Quranic content.',
        'about-tech-database': 'Local database',
        'about-tech-audio': 'Advanced audio analysis',
        'about-tech-native': 'Native interface',
        'about-contact-title': 'Contact Us',
        'about-contact-desc': 'Have questions, suggestions or want to contribute to the project? Don\'t hesitate to contact us.',
        'about-contact-btn': 'Contact Us',
        'about-faq-btn': 'View FAQ'
    },

    ar: {
        // Navigation
        'nav-home': 'الرئيسية',
        'nav-features': 'الميزات',
        'nav-screenshots': 'الصور',
        'nav-download': 'تحميل',
        'nav-support': 'دعم',
        'nav-privacy': 'الخصوصية',

        // Hero Section
        'hero-subtitle': 'تطبيق حديث لتعلم ومراجعة القرآن الكريم',
        'hero-description': 'تجربة تعليمية كاملة مع نظام أخطاء التجويد، أهداف شخصية، تسجيلات صوتية وتتبع متقدم للتقدم.',
        'hero-quote': '"عن عثمان بن عفان رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"',
        'hero-quote-translation': '',
        'hero-quote-reference': 'رواه البخاري (5027) - السند: عثمان بن عفان رضي الله عنه - صحيح',
        'btn-download': 'تحميل',
        'btn-discover': 'استكشاف',
        'scroll-hint': 'استكشاف',

        // Stats
        'stat-users': 'مستخدمين نشطين',
        'stat-satisfaction': 'رضا المستخدمين',
        'stat-rating': '★ متوسط التقييم',
        'stat-hours': 'ساعات التعلم',

        // Features
        'features-title': 'الميزات الرئيسية',
        'features-description': 'مجموعة كاملة من الأدوات لتعلم ومراجعة القرآن الكريم',
        
        // Tutorials
        'tutorials-title': 'دروس فيديو تعليمية',
        'tutorials-description': 'تعلم كيفية استخدام التطبيق مع دروسنا القصيرة والعملية',
        'tutorial-1-title': 'الاستخدام الأول',
        'tutorial-1-desc': 'تعلم أساسيات التطبيق',
        'tutorial-2-title': 'نظام المراجعة',
        'tutorial-2-desc': 'إنشاء أهداف المراجعة الخاصة بك',
        'tutorial-3-title': 'اكتشاف أخطاء التجويد',
        'tutorial-3-desc': 'استخدم نظام تحليل الصوت',
        
        // Privacy
        'privacy-title': 'الخصوصية والأمان',
        'privacy-description': 'خصوصيتك هي أولويتنا. اكتشف كيف نحمي بياناتك.',
        'privacy-no-account-title': 'بدون حساب مستخدم',
        'privacy-no-account-desc': 'لا يلزم التسجيل، استخدم التطبيق فوراً بدون مشاركة معلومات',
        'privacy-anonymous-title': 'استخدام مجهول',
        'privacy-anonymous-desc': 'لا يتم جمع أو مشاركة أي بيانات شخصية مع أطراف ثالثة',
        'privacy-local-title': 'تخزين محلي',
        'privacy-local-desc': 'تقدمك وأهدافك تبقى على جهازك فقط',
        'privacy-no-tracking-title': 'بدون تتبع',
        'privacy-no-tracking-desc': 'لا إعلانات، لا تتبع سلوكي، لا تحليلات تطفلية',
        'privacy-audio-title': 'تسجيلات خاصة',
        'privacy-audio-desc': 'تسجيلاتك الصوتية تبقى على جهازك، لا تُرسل أبداً للخوادم',
        'privacy-offline-title': 'وضع عدم الاتصال',
        'privacy-offline-desc': 'وظائف كاملة بدون اتصال إنترنت، حماية تامة للخصوصية',
        'privacy-policy-btn': 'قراءة السياسة الكاملة',
        
        'feature-mushaf-title': 'مصحف تفاعلي',
        'feature-mushaf-desc': 'تصفح القرآن الكريم مع 6 روايات مختلفة (حفص، ورش، البزي، إلخ) بجودة عالية مع واجهة لمسية سهلة.',
        
        'feature-audio-title': 'التسجيلات الصوتية',
        'feature-audio-desc': 'سجل تلاوتك مع نظام التسميع، استمع لتقدمك وشارك مع معلمك.',
        
        'feature-tajweed-title': 'أخطاء التجويد',
        'feature-tajweed-desc': 'نظام متقدم لوسم الأخطاء مع أكثر من 12 نوع من أخطاء التجويد، مع التعليقات والإحصائيات المفصلة.',
        
        'feature-objectives-title': 'أهداف شخصية',
        'feature-objectives-desc': 'حدد أهدافك الشهرية والسنوية، تتبع تقدمك مع إحصائيات بصرية.',
        
        'feature-tekrar-title': 'نظام التكرار',
        'feature-tekrar-desc': 'إنشاء عدادات تكرار للسور والصفحات والآيات مع تتبع تلقائي للتقدم.',
        
        'feature-stats-title': 'إحصائيات متقدمة',
        'feature-stats-desc': 'تصور تقدمك بالرسوم البيانية المفصلة، الأيام المتتالية وتحليل الأخطاء لكل سورة.',

        // Screenshots
        'screenshots-title': 'لقطات الشاشة',
        'screenshots-description': 'اكتشف الواجهة الحديثة والسهلة للتطبيق',
        'screenshot-home': 'الشاشة الرئيسية',
        'screenshot-mushaf': 'واجهة المصحف',
        'screenshot-revision': 'نظام المراجعة',
        'screenshot-audio': 'التسجيلات الصوتية',
        'screenshot-profiles': 'إدارة الملفات الشخصية',
        'screenshot-stats': 'إحصائيات مفصلة',
        'screenshot-objectives': 'الأهداف الشخصية',
        'screenshot-navigation': 'تصفح المصحف',

        // Download
        'download-title': 'تحميل التطبيق',
        'download-description': 'متاح مجاناً على جميع المنصات',
        'download-on': 'متاح على',
        'download-for': 'لـ',
        'download-secure': '100% آمن',
        'download-free': 'مجاني بالكامل',
        'download-multilang': 'متعدد اللغات',

        // Footer
        'footer-description': 'تطبيق حديث لتعلم ومراجعة القرآن الكريم مع ميزات متقدمة لجميع المستويات.',
        'footer-links': 'روابط مفيدة',
        'footer-guide': 'دليل المستخدم',
        'footer-privacy': 'الخصوصية',
        'footer-support': 'الدعم',
        'footer-contact': 'اتصل بنا',
        'footer-faq': 'الأسئلة الشائعة',
        'footer-about': 'حول',
        'footer-follow': 'تابعنا',
        'footer-copyright': '© 2025 حَامِلُ الْقُرْآنْ - Hamil Al-Quran. جميع الحقوق محفوظة.',
        
        // Common
        'back-to-home': 'العودة للرئيسية',
        
        // Contact page
        'contact-title': 'اتصل بنا',
        'contact-subtitle': 'نحن هنا لمساعدتك. لا تتردد في التواصل معنا.',
        'contact-email-title': 'البريد الإلكتروني',
        'contact-email-desc': 'أرسل لنا رسالة وسنجيبك بسرعة',
        'contact-support-title': 'الدعم الفني',
        'contact-support-desc': 'تحتاج مساعدة مع التطبيق؟ راجع الأسئلة الشائعة أو تواصل معنا',
        'contact-faq-link': 'عرض الأسئلة الشائعة',
        'contact-suggestions-title': 'الاقتراحات',
        'contact-suggestions-desc': 'لديك أفكار لتحسين التطبيق؟ شاركها معنا',
        'contact-form-title': 'أرسل لنا رسالة',
        'contact-form-name': 'الاسم',
        'contact-form-email': 'البريد الإلكتروني',
        'contact-form-subject': 'الموضوع',
        'contact-form-subject-select': 'اختر موضوعاً',
        'contact-form-subject-support': 'دعم فني',
        'contact-form-subject-suggestion': 'اقتراح',
        'contact-form-subject-bug': 'تبليغ عن خطأ',
        'contact-form-subject-other': 'أخرى',
        'contact-form-message': 'الرسالة',
        'contact-form-send': 'إرسال الرسالة',
        
        // FAQ page
        'faq-title': 'الأسئلة الشائعة',
        'faq-subtitle': 'اعثر بسرعة على إجابات للأسئلة الأكثر شيوعاً حول التطبيق.',
        'faq-cat-general': 'عام',
        'faq-cat-features': 'الميزات',
        'faq-cat-technical': 'تقني',
        'faq-cat-privacy': 'الخصوصية',
        'faq-q1': 'ما هو تطبيق حَامِلُ الْقُرْآنْ؟',
        'faq-a1': 'حَامِلُ الْقُرْآنْ هو تطبيق حديث لتعلم ومراجعة القرآن الكريم يوفر ميزات متقدمة لحفظ ومراجعة وتحسين تلاوة القرآن مع أدوات تحليل التجويد.',
        'faq-q2': 'هل التطبيق مجاني؟',
        'faq-a2': 'نعم، التطبيق مجاني بالكامل. لا يتطلب اشتراك أو مشتريات داخل التطبيق للوصول لجميع الميزات.',
        'faq-q3': 'على أي منصات متاح التطبيق؟',
        'faq-a3': 'التطبيق متاح على أندرويد وآي أو إس. يمكنك تحميله من متجر جوجل بلاي ومتجر آب ستور.',
        'faq-q4': 'ما أنواع المصاحف المتاحة؟',
        'faq-a4': 'التطبيق يوفر 6 أنواع مختلفة من المصاحف تشمل حفص وورش والبزي وقراءات أخرى أصيلة للقرآن.',
        'faq-q5': 'كيف يعمل اكتشاف أخطاء التجويد؟',
        'faq-a5': 'النظام يحلل تلاوتك ويحدد أكثر من 12 نوع من أخطاء التجويد الشائعة، مما يتيح لك تحسين نطقك وتلاوتك.',
        'faq-q6': 'هل يمكنني تحديد أهداف شخصية؟',
        'faq-a6': 'نعم، يمكنك تحديد أهداف شهرية وسنوية، وتتبع تقدمك بإحصائيات مفصلة ومرئية.',
        'faq-q7': 'هل يعمل التطبيق بدون إنترنت؟',
        'faq-a7': 'نعم، جميع الميزات الأساسية للتطبيق تعمل بدون اتصال إنترنت بمجرد تحميله.',
        'faq-q8': 'هل يمكنني نسخ احتياطي لبياناتي؟',
        'faq-a8': 'بياناتك محفوظة تلقائياً محلياً على جهازك. لا تتطلب مزامنة سحابية.',
        'faq-q9': 'هل بياناتي الشخصية آمنة؟',
        'faq-a9': 'لا يتم جمع أي بيانات شخصية. جميع معلوماتك تبقى مخزنة محلياً على جهازك.',
        'faq-q10': 'هل يستخدم التطبيق متتبعات؟',
        'faq-a10': 'لا، التطبيق لا يحتوي على أي متتبعات أو إعلانات أو تحليلات تطفلية. خصوصيتك محترمة.',
        
        // About page
        'about-title': 'حول حَامِلُ الْقُرْآنْ',
        'about-subtitle': 'اكتشف رسالتنا والقيم التي توجه تطوير هذا التطبيق.',
        'about-mission-title': 'رسالتنا',
        'about-mission-desc': 'إنشاء تطبيق حديث ومتاح يسهل تعلم وحفظ ومراجعة القرآن الكريم لجميع المسلمين، مهما كان مستواهم.',
        'about-vision-title': 'رؤيتنا',
        'about-vision-desc': 'أن نصبح الأداة المرجعية لدراسة القرآن، بدمج التقاليد الإسلامية والابتكار التكنولوجي للحفاظ على هذا التراث الثمين ونقله.',
        'about-values-title': 'قيمنا',
        'about-value-respect-title': 'الاحترام',
        'about-value-respect-desc': 'احترام عميق للنص المقدس وتقاليد التعلم الإسلامية.',
        'about-value-accessibility-title': 'إمكانية الوصول',
        'about-value-accessibility-desc': 'جعل تعلم القرآن متاحاً للجميع، في كل مكان وفي أي وقت.',
        'about-value-privacy-title': 'الخصوصية',
        'about-value-privacy-desc': 'حماية تامة للخصوصية مع التخزين المحلي وعدم التتبع.',
        'about-value-innovation-title': 'الابتكار',
        'about-value-innovation-desc': 'استخدام أحدث التقنيات لتحسين تجربة التعلم.',
        'about-value-free-title': 'مجاني',
        'about-value-free-desc': 'تطبيق مجاني بالكامل بدون إعلانات أو اشتراكات.',
        'about-value-universal-title': 'عالمي',
        'about-value-universal-desc': 'دعم متعدد اللغات لمجتمع إسلامي عالمي ومتنوع.',
        'about-tech-title': 'التكنولوجيا',
        'about-tech-desc': 'التطبيق مطور بـ Flutter، مما يضمن أداءً عالياً وتجربة أصلية على أندرويد وآي أو إس. نستخدم خوارزميات متقدمة لتحليل الصوت لاكتشاف أخطاء التجويد وقواعد بيانات محسنة للوصول السريع للمحتوى القرآني.',
        'about-tech-database': 'قاعدة بيانات محلية',
        'about-tech-audio': 'تحليل صوتي متقدم',
        'about-tech-native': 'واجهة أصلية',
        'about-contact-title': 'تواصل معنا',
        'about-contact-desc': 'لديك أسئلة أو اقتراحات أو تريد المساهمة في المشروع؟ لا تتردد في التواصل معنا.',
        'about-contact-btn': 'تواصل معنا',
        'about-faq-btn': 'عرض الأسئلة الشائعة'
    }
};

function getTranslation(key, language) {
    return translations[language] && translations[language][key] || translations.fr[key] || key;
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, getTranslation };
}

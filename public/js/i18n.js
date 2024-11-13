class I18n {
    constructor() {
        this.translations = {};
        this.games = {};
        this.supportedLanguages = {
            en: { name: 'English', flag: 'gb' },
            zh: { name: '中文', flag: 'cn' }
        };
        this._currentLang = this.getSavedLanguage() || this.detectLanguage();
        this.updateUILanguage(this._currentLang);
        
        // Track ongoing fetch requests
        this._fetchPromises = {};

        // Load initial translations
        this.loadTranslations(this._currentLang);
    }

    async loadTranslations(lang) {
        // Check if translations are already loaded for this language
        if (this.hasTranslations(lang)) {
            return true;
        }

        // Check if a fetch request is already in progress for this language
        if (this._fetchPromises[lang]) {
            return this._fetchPromises[lang];
        }

        // Start a new fetch request and store the promise
        this._fetchPromises[lang] = (async () => {
            try {
                // Load translations
                const translationResponse = await fetch(`/locales/${lang}.json`);
                const translations = await translationResponse.json();
                
                // Load game config
                const gameConfigResponse = await fetch(`/config/games/${lang}.json`);
                const gameConfig = await gameConfigResponse.json();
                
                // Register translations and games
                this.register(lang, translations);
                this.registerGames(gameConfig);
                
                return true;
            } catch (error) {
                console.error(`Failed to load ${lang} translations:`, error);
                return false;
            } finally {
                // Remove the promise from the tracking object once completed
                delete this._fetchPromises[lang];
            }
        })();

        return this._fetchPromises[lang];
    }

    hasTranslations(lang) {
        return Boolean(this.translations[lang] && Object.keys(this.translations[lang]).length > 0);
    }

    getCurrentLanguage() {
        return this._currentLang;
    }

    detectLanguage() {
        const browserLang = navigator.language.toLowerCase();
        const supportedLanguages = ['en', 'zh'];
        
        // Check if browser language matches any of our supported languages
        for (const lang of supportedLanguages) {
            if (browserLang.startsWith(lang)) {
                return lang;
            }
        }
        
        return 'en'; // fallback to English
    }

    register(lang, translations) {
        this.translations[lang] = translations;
        if (lang === this._currentLang) {
            this.notifyTextsUpdated();
        }
    }

    registerGames(games) {
        this.games = {
            ...this.games,
            ...games
        };
        this.notifyTextsUpdated();
    }

    async setLanguage(lang) {
        if (await this.loadTranslations(lang)) {
            this._currentLang = lang;
            localStorage.setItem('preferred_language', lang);
            this.updateUILanguage(lang);
            this.notifyTextsUpdated();
            return true;
        }
        return false;
    }

    updateUILanguage(lang) {
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Emit language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang } 
        }));
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this._currentLang];
        
        for (const k of keys) {
            if (value === undefined) break;
            value = value[k];
        }
        
        return value || key;
    }

    notifyTextsUpdated() {
        window.dispatchEvent(new Event('textsUpdated'));
    }

    getSavedLanguage() {
        return localStorage.getItem('preferred_language');
    }
}

// Create global i18n instance
window.i18n = new I18n();

// listen for language changes
window.addEventListener('languageChange', (e) => {
    window.i18n.setLanguage(e.detail);
}); 
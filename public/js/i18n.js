class I18n {
    constructor() {
        this.translations = {};
        this.games = {};
        this._currentLang = this.detectLanguage();
        this.updateUILanguage(this._currentLang);
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

    setLanguage(lang) {
        if (this.translations[lang]) {
            this._currentLang = lang;
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
}

// Create global i18n instance
window.i18n = new I18n();

// listen for language changes
window.addEventListener('languageChange', (e) => {
    window.i18n.setLanguage(e.detail);
}); 
window.i18n = {
    en: {},  // initialize language objects
    zh: {},
    currentLang: localStorage.getItem('lang') || 'en',

    t(key, params = {}) {
        try {
            const text = key.split('.').reduce((obj, k) => {
                if (obj === undefined || obj === null) throw new Error();
                return obj[k];
            }, this[this.currentLang]);

            if (text === undefined || text === null) {
                console.warn(`Translation missing for key: ${key}`);
                return key;
            }

            return text.replace(/{(\w+)}/g, (_, k) => params[k] || '');
        } catch (e) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
    },

    register(lang, translations) {
        this[lang] = translations;
    },

    updateLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        window.dispatchEvent(new CustomEvent('textsUpdated'));
    }
};

// listen for language changes
window.addEventListener('languageChange', (e) => {
    window.i18n.updateLang(e.detail);
}); 
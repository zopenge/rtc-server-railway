async function loadTranslations(lang) {
    try {
        // Load translations
        const translationResponse = await fetch(`/locales/${lang}.json`);
        const translations = await translationResponse.json();
        
        // Load game config
        const gameConfigResponse = await fetch(`/config/games/${lang}.json`);
        const gameConfig = await gameConfigResponse.json();
        
        // Register with i18n system
        i18n.register(lang, translations);
        i18n.registerGames(gameConfig);
        
        return true;
    } catch (error) {
        console.error(`Failed to load ${lang} translations:`, error);
        return false;
    }
}

window.loadTranslations = loadTranslations; 
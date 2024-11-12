class TopNavigation extends UserNavigation {
    constructor() {
        super({
            className: 'top-nav',
            leftContent: `<h1>${i18n.t('nav.title')}</h1>`
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => this.updateTitle());
    }

    updateTitle() {
        const titleElement = this.container.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = i18n.t('nav.title');
        }
    }
}

// Export as class instead of instance
window.TopNavigation = TopNavigation;
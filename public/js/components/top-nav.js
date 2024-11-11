class TopNavigation extends UserNavigation {
    constructor() {
        super({
            className: 'top-nav',
            leftContent: `<h1>${i18n.t('nav.title')}</h1>`
        });
    }
}

// Export as class instead of instance
window.TopNavigation = TopNavigation;
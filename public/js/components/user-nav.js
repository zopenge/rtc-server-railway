class UserNavigation extends BaseNavigation {
    constructor(config = {}) {
        super({
            className: config.className || 'nav-workspace',
            leftContent: config.leftContent || `<h1>${i18n.t('workspace.title')}</h1>`,
            rightContent: `
                <div class="user-info">
                    <span id="username">${localStorage.getItem('username') || ''}</span>
                </div>
            `
        });
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/';
    }
} 
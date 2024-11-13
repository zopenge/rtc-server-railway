class AuthNavigation extends BaseNavigation {
    constructor() {
        super({
            className: 'nav-auth',
            rightContent: null,
            events: {
                '.login-btn': () => App.showLogin(),
                '.register-btn': () => App.showRegister()
            }
        });

        // Wait for initial translations to load
        window.addEventListener('textsUpdated', () => {
            if (!this.config.rightContent) {
                this.config.rightContent = this._renderAuthButtons();
                if (this.container) {
                    const rightContent = this.container.querySelector('.nav-right');
                    if (rightContent) {
                        rightContent.innerHTML = `
                            ${this.renderLanguageSelector()}
                            ${this.config.rightContent}
                        `;
                        // Rebind language selector events after updating content
                        this._bindLanguageEvents(this.container);
                        this._bindCustomEvents();
                    }
                }
            }
            this.updateTexts();
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => this.updateTexts());
    }

    _renderAuthButtons() {
        return `
            <div class="auth-buttons">
                <button type="button" class="login-btn">
                    <span id="loginText">${i18n.t('nav.login')}</span>
                </button>
                <button type="button" class="register-btn">
                    <span id="registerText">${i18n.t('nav.register')}</span>
                </button>
            </div>
        `;
    }

    updateTexts() {
        const loginText = document.getElementById('loginText');
        const registerText = document.getElementById('registerText');
        
        if (loginText) loginText.textContent = i18n.t('nav.login');
        if (registerText) registerText.textContent = i18n.t('nav.register');
    }
}

// Make it globally available
window.AuthNavigation = AuthNavigation; 
class BaseNavigation {
    constructor(config) {
        this.config = config;
        Object.assign(this, LanguageSelectorMixin);
        // Store container reference for later use
        this.container = null;
    }

    render() {
        return `
            <nav class="${this.config.className || 'nav-default'}">
                <div class="nav-left">
                    ${this.config.leftContent || ''}
                </div>
                <div class="nav-right">
                    ${this.renderLanguageSelector()}
                    ${this.config.rightContent || ''}
                </div>
            </nav>
        `;
    }

    renderLanguageSelector() {
        return `
            <div class="lang-select">
                <div class="lang-current">
                    <img id="currentFlag" src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${this._getCurrentFlag()}.svg" 
                         class="flag" alt="${this._getCurrentLanguageName()}">
                    <span class="lang-name">${this._getCurrentLanguageName()}</span>
                    <span class="arrow-down">▼</span>
                </div>
                <ul id="langDropdown" class="lang-dropdown">
                    ${this._renderLanguageOptions()}
                </ul>
            </div>
        `;
    }

    init(containerId = 'navContainer') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container ${containerId} not found`);
            return;
        }
        this.container.innerHTML = this.render();

        // Add language change event listener
        window.addEventListener('languageChanged', () => {
            this._updateLanguageDisplay();
        });

        this._bindLanguageEvents(this.container);
        this._bindCustomEvents();
    }

    _bindCustomEvents() {
        if (this.config.events) {
            Object.entries(this.config.events).forEach(([selector, handler]) => {
                document.querySelector(selector)?.addEventListener('click', handler);
            });
        }
    }

    _updateLanguageDisplay() {
        const currentFlag = this.container.querySelector('#currentFlag');
        const langName = this.container.querySelector('.lang-name');
        if (currentFlag && langName) {
            currentFlag.src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${this._getCurrentFlag()}.svg`;
            currentFlag.alt = this._getCurrentLanguageName();
            langName.textContent = this._getCurrentLanguageName();
        }
    }
} 
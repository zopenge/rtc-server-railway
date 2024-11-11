const LanguageSelector = {
    render() {
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
    },

    _getCurrentLanguageName() {
        const currentLang = i18n.getCurrentLanguage();
        const languages = {
            en: 'English',
            zh: '中文'
        };
        return languages[currentLang] || currentLang;
    },

    _getCurrentFlag() {
        const currentLang = i18n.getCurrentLanguage();
        return window.App?.SUPPORTED_LANGUAGES[currentLang]?.flag || 'gb';
    },

    _renderLanguageOptions() {
        return Object.entries(window.App?.SUPPORTED_LANGUAGES || {
            en: { name: 'English', flag: 'gb' },
            zh: { name: '中文', flag: 'cn' }
        }).map(([code, lang]) => `
            <li data-lang="${code}">
                <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${lang.flag}.svg" 
                     class="flag" alt="${lang.name}">
                <span>${lang.name}</span>
            </li>
        `).join('');
    },

    _updateDisplay(container) {
        const currentFlag = container.querySelector('#currentFlag');
        const langName = container.querySelector('.lang-name');
        if (currentFlag && langName) {
            currentFlag.src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${this._getCurrentFlag()}.svg`;
            currentFlag.alt = this._getCurrentLanguageName();
            langName.textContent = this._getCurrentLanguageName();
        }
    },

    _bindEvents(container) {
        const langSelect = container.querySelector('.lang-select');
        const langDropdown = container.querySelector('.lang-dropdown');
        const self = this;

        // Language change event listener
        window.addEventListener('languageChanged', () => {
            self._updateDisplay(container);
        });

        langSelect?.querySelector('.lang-current').addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown?.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown?.classList.remove('show');
        });

        langDropdown?.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) {
                const lang = li.dataset.lang;
                i18n.setLanguage(lang);
            }
        });
    },

    // For standalone usage
    init(container) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.render();
        container.appendChild(wrapper.firstElementChild);
        this._bindEvents(container);
    },

    // For mixin usage
    asMixin() {
        const { render, _getCurrentLanguageName, _getCurrentFlag, _renderLanguageOptions, _updateDisplay } = this;
        return {
            renderLanguageSelector: render,
            _getCurrentLanguageName,
            _getCurrentFlag,
            _renderLanguageOptions,
            _updateDisplay,
            _bindLanguageEvents: function(container) {
                const langSelect = container.querySelector('.lang-select');
                const langDropdown = container.querySelector('.lang-dropdown');

                // Language change event listener
                window.addEventListener('languageChanged', () => {
                    _updateDisplay.call(this, container);
                });

                langSelect?.querySelector('.lang-current')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    langDropdown?.classList.toggle('show');
                });

                document.addEventListener('click', () => {
                    langDropdown?.classList.remove('show');
                });

                langDropdown?.addEventListener('click', (e) => {
                    const li = e.target.closest('li');
                    if (li) {
                        const lang = li.dataset.lang;
                        i18n.setLanguage(lang);
                    }
                });
            }
        };
    }
};

// Export both the component and mixin
window.LanguageSelector = LanguageSelector;
window.LanguageSelectorMixin = LanguageSelector.asMixin(); 
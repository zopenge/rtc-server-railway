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
        return window.App?.SUPPORTED_LANGUAGES[currentLang]?.name || currentLang;
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

    init(container) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.render();
        container.appendChild(wrapper.firstElementChild);
        this._bindEvents(container);
    },

    _bindEvents(container) {
        const langSelect = container.querySelector('.lang-select');
        const langDropdown = container.querySelector('.lang-dropdown');

        langSelect?.querySelector('.lang-current').addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown?.classList.remove('show');
        });

        langDropdown?.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) {
                const lang = li.dataset.lang;
                App.changeLang(lang);
            }
        });
    }
};

window.LanguageSelector = LanguageSelector; 
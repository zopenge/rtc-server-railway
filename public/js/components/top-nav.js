window.TopNavigation = {
    render() {
        return `
            <nav class="top-nav">
                <div class="nav-left">
                    <h1>${i18n.t('workspace.title')}</h1>
                </div>
                <div class="nav-right">
                    <div id="langSelectContainer"></div>
                    <div class="user-info">
                        <span id="username">${localStorage.getItem('username') || ''}</span>
                        <button id="logoutBtn">${i18n.t('nav.logout')}</button>
                    </div>
                </div>
            </nav>
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

    init() {
        const nav = document.createElement('div');
        nav.innerHTML = this.render();
        document.body.insertBefore(nav.firstElementChild, document.body.firstChild);
        this._bindEvents();
    },

    _bindEvents() {
        const langSelect = document.querySelector('.lang-select');
        const langDropdown = document.querySelector('.lang-dropdown');

        // Language dropdown toggle
        langSelect?.querySelector('.lang-current').addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langDropdown?.classList.remove('show');
        });

        // Language selection
        langDropdown?.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) {
                const lang = li.dataset.lang;
                App.changeLang(lang);
            }
        });

        // Logout handler
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/';
        });
    }
}; 
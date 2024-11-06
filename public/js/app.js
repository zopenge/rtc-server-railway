const App = (function () {
    let content;

    // supported languages configuration
    const SUPPORTED_LANGUAGES = {
        en: {
            name: 'English',
            flag: 'gb',
            browserLangs: ['en', 'en-us', 'en-gb']
        },
        zh: {
            name: '中文',
            flag: 'cn',
            browserLangs: ['zh', 'zh-cn', 'zh-tw', 'zh-hk']
        }
    };

    function detectLanguage(browserLang) {
        for (const [langCode, langData] of Object.entries(SUPPORTED_LANGUAGES)) {
            if (langData.browserLangs.some(supported =>
                browserLang.startsWith(supported))) {
                return langCode;
            }
        }
        return 'en';
    }

    function updateNavTexts() {
        document.getElementById('loginText').textContent = i18n.t('nav.login');
        document.getElementById('registerText').textContent = i18n.t('nav.register');
    }

    async function loadPage(page) {
        try {
            const response = await fetch(`/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            content.innerHTML = html;

            const script = document.createElement('script');
            script.src = `/js/pages/${page}.js`;
            script.onload = () => {
                PageLifecycle.mount(page);
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error('Failed to load page:', error);
            content.innerHTML = '<p>Failed to load content. Please try again later.</p>';
        }
    }

    return {
        init() {
            // initialize DOM references first
            content = document.getElementById('content');
            if (!content) {
                console.error('Failed to initialize: content element not found');
                return;
            }

            // initialize language
            const browserLang = navigator.language.toLowerCase();
            const defaultLang = detectLanguage(browserLang);
            const lang = localStorage.getItem('lang') || defaultLang;

            const currentFlag = document.getElementById('currentFlag');
            const langName = document.querySelector('.lang-name');

            currentFlag.src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${SUPPORTED_LANGUAGES[lang].flag}.svg`;
            currentFlag.alt = SUPPORTED_LANGUAGES[lang].name;
            langName.textContent = SUPPORTED_LANGUAGES[lang].name;

            updateNavTexts();
            loadPage('welcome');

            // setup event listeners
            this.setupEventListeners();
        },

        setupEventListeners() {
            // language dropdown
            document.querySelector('.lang-current').addEventListener('click', this.toggleLangDropdown);

            // language selection
            document.querySelectorAll('.lang-dropdown li').forEach(li => {
                li.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    this.changeLang(lang);
                });
            });

            // auth buttons
            document.querySelector('.login-btn').addEventListener('click', this.showLogin);
            document.querySelector('.register-btn').addEventListener('click', this.showRegister);

            // handle back/forward buttons
            window.addEventListener('popstate', this.handlePopState);
        },

        toggleLangDropdown() {
            const dropdown = document.getElementById('langDropdown');
            dropdown.classList.toggle('show');

            document.addEventListener('click', function closeDropdown(e) {
                if (!e.target.closest('.lang-select')) {
                    dropdown.classList.remove('show');
                    document.removeEventListener('click', closeDropdown);
                }
            });
        },

        changeLang(lang) {
            if (!SUPPORTED_LANGUAGES[lang]) return;

            const currentFlag = document.getElementById('currentFlag');
            const langName = document.querySelector('.lang-name');

            currentFlag.src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${SUPPORTED_LANGUAGES[lang].flag}.svg`;
            currentFlag.alt = SUPPORTED_LANGUAGES[lang].name;
            langName.textContent = SUPPORTED_LANGUAGES[lang].name;

            document.getElementById('langDropdown').classList.remove('show');

            localStorage.setItem('lang', lang);
            window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
            updateNavTexts();
        },

        showLogin() {
            loadPage('login').catch(() => {
                history.pushState(null, '', '/');
                loadPage('welcome');
            });
            history.pushState(null, '', '/user/login');
        },

        showRegister() {
            loadPage('login').catch(() => {
                history.pushState(null, '', '/');
                loadPage('welcome');
            });
            history.pushState(null, '', '/user/register');
            setTimeout(() => {
                const registerTab = document.querySelector('[data-form="register"]');
                if (registerTab) {
                    registerTab.click();
                }
            }, 100);
        },

        handlePopState() {
            const path = location.pathname;
            const pageMap = {
                '/user/login': 'login',
                '/user/register': 'login',
                '/welcome': 'welcome',
                '/workspace': 'workspace',
                '/': 'welcome'
            };

            const page = pageMap[path] || 'welcome';
            loadPage(page).then(() => {
                // Add special handling for register page
                if (path === '/user/register') {
                    // Add small delay to ensure DOM is ready
                    setTimeout(() => {
                        const registerTab = document.querySelector('[data-form="register"]');
                        if (registerTab) {
                            registerTab.click();
                        }
                    }, 100);
                }
                
                // Add confirmation when leaving login/register page
                if (path !== '/user/login' && path !== '/user/register') {
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                } else {
                    window.addEventListener('beforeunload', handleBeforeUnload);
                }
            });
        }
    };
})();

// Add beforeunload handler
function handleBeforeUnload(e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
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

    function populateLangDropdown() {
        const dropdown = document.getElementById('langDropdown');
        dropdown.innerHTML = Object.entries(SUPPORTED_LANGUAGES)
            .map(([code, data]) => `
                <li data-lang="${code}">
                    <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${data.flag}.svg" 
                         class="flag" alt="${data.name}">
                    <span>${data.name}</span>
                </li>
            `).join('');

        // Add event listeners after populating the dropdown
        dropdown.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                App.changeLang(lang);
            });
        });
    }

    function updateLanguageUI(lang) {
        if (!SUPPORTED_LANGUAGES[lang]) return;

        const currentFlag = document.getElementById('currentFlag');
        const langName = document.querySelector('.lang-name');

        if (currentFlag && langName) {
            currentFlag.src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${SUPPORTED_LANGUAGES[lang].flag}.svg`;
            currentFlag.alt = SUPPORTED_LANGUAGES[lang].name;
            langName.textContent = SUPPORTED_LANGUAGES[lang].name;
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
            const detectedLang = detectLanguage(browserLang);
            const storedLang = localStorage.getItem('lang');
            const initialLang = storedLang || detectedLang;

            // Set initial language in i18n system
            i18n.setLanguage(initialLang);
            localStorage.setItem('lang', initialLang);

            // Update UI for initial language
            updateLanguageUI(initialLang);

            // Listen for language changes
            window.addEventListener('languageChanged', (e) => {
                const newLang = e.detail.lang;
                localStorage.setItem('lang', newLang);
                updateLanguageUI(newLang);
                updateNavTexts();
            });

            updateNavTexts();
            loadPage('welcome');

            // setup event listeners
            this.setupEventListeners();

            // populate language dropdown
            populateLangDropdown();
        },

        setupEventListeners() {
            // language dropdown toggle
            document.querySelector('.lang-current').addEventListener('click', this.toggleLangDropdown);

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

            i18n.setLanguage(lang);
            document.getElementById('langDropdown').classList.remove('show');
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
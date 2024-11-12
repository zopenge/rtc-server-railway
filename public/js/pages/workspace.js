// Core workspace management
const Workspace = (function() {
    // private state
    const _views = new Map();
    let _currentView = null;

    // private methods
    function _updateNavigation(viewId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            }
        });
    }

    function _handleLanguageChange() {
        // Re-render current view when language changes
        if (_currentView && _views.get(_currentView)) {
            const view = _views.get(_currentView);
            view.render();
        }

        // Update navigation text
        document.querySelectorAll('.nav-item').forEach(item => {
            const viewId = item.getAttribute('data-view');
            if (viewId) {
                item.textContent = i18n.t(`workspace.nav.${viewId}`);
            }
        });

        // Update settings button text
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.textContent = i18n.t('workspace.actions.settings');
        }
    }

    // public API
    return {
        // register a new view module
        registerView(viewId, viewModule) {
            if (_views.has(viewId)) {
                console.warn(`View ${viewId} is already registered`);
                return;
            }
            _views.set(viewId, viewModule);
        },

        // switch to a specific view
        switchView(viewId, params = {}) {
            const view = _views.get(viewId);
            if (!view) {
                console.error(`View ${viewId} not found`);
                return;
            }

            // cleanup current view if exists
            if (_currentView && _views.get(_currentView).cleanup) {
                _views.get(_currentView).cleanup();
            }

            // update navigation state
            _updateNavigation(viewId);

            // render new view
            _currentView = viewId;
            view.render(params);
        },

        // initialize workspace
        async init() {
            try {
                // Wait for translations to be loaded
                const currentLang = i18n.getCurrentLanguage();
                await loadTranslations(currentLang);
                
                // Listen for language changes
                window.addEventListener('languageChanged', _handleLanguageChange);
                
                // Initialize all registered views
                for (const [viewId, view] of _views.entries()) {
                    if (view.init) {
                        await view.init();
                    }
                }

                // Update all navigation text
                document.querySelectorAll('.nav-item').forEach(item => {
                    const viewId = item.getAttribute('data-view');
                    if (viewId) {
                        item.textContent = i18n.t(`workspace.nav.${viewId}`);
                    }
                });

                // Update settings button text
                const settingsBtn = document.getElementById('settingsBtn');
                if (settingsBtn) {
                    settingsBtn.textContent = i18n.t('workspace.actions.settings');
                }
                
                // switch to default view
                this.switchView('tasks');
            } catch (error) {
                console.error('Failed to initialize workspace:', error);
            }
        }
    };
})();

// Export to global scope
window.Workspace = Workspace; 
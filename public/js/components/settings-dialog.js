const SettingsDialog = {
    _currentTab: 'basic',

    async init() {
        if (document.querySelector('.settings-dialog')) {
            return;
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'settings-dialog';
        dialog.innerHTML = await this.render();
        
        document.body.appendChild(dialog);
        this._bindEvents();
        
        // Listen for text updates
        window.addEventListener('textsUpdated', this._updateTexts.bind(this));
    },

    async _updateTexts() {
        const dialog = document.querySelector('.settings-dialog');
        if (dialog) {
            dialog.innerHTML = await this.render();
            this._bindEvents();
        }
    },

    // Show the settings dialog
    show() {
        const dialog = document.querySelector('.settings-dialog');
        dialog?.classList.add('show');
    },

    // Hide the settings dialog
    hide() {
        const dialog = document.querySelector('.settings-dialog');
        dialog?.classList.remove('show');
    },

    async render() {
        try {
            const response = await fetch('/templates/settings-dialog.html');
            const template = await response.text();
            
            // Replace template variables with actual values
            return template.replace(/\${([^}]*)}/g, (match, key) => {
                if (key.startsWith('i18n.t(')) {
                    // Handle i18n translations
                    const translationKey = key.slice(8, -2); // Remove i18n.t(' and ')
                    return i18n.t(translationKey);
                } else if (key.startsWith('localStorage.getItem(')) {
                    // Handle localStorage values
                    const storageKey = key.slice(22, -2); // Remove localStorage.getItem(' and ')
                    return localStorage.getItem(storageKey) || '';
                }
                return match;
            });
        } catch (error) {
            console.error('Failed to load settings dialog template:', error);
            return '';
        }
    },

    _bindEvents() {
        const dialog = document.querySelector('.settings-dialog');
        
        // Tab switching
        dialog?.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this._switchTab(tab);
            });
        });

        // Close button handler
        dialog?.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });

        // Cancel button handler
        dialog?.querySelector('.cancel-btn').addEventListener('click', () => {
            this.hide();
        });

        // Save button handler
        dialog?.querySelector('.save-btn').addEventListener('click', () => {
            const nickname = document.getElementById('nickname')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;

            // Save user settings to localStorage
            localStorage.setItem('nickname', nickname || '');
            localStorage.setItem('email', email || '');
            localStorage.setItem('phone', phone || '');

            this.hide();
        });

        // Close dialog when clicking outside
        dialog?.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hide();
            }
        });

        // Logout button handler
        dialog?.querySelector('.logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '/';
        });
    },

    _switchTab(tab) {
        const dialog = document.querySelector('.settings-dialog');
        
        // Update tab buttons active state
        dialog?.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update tab contents visibility
        dialog?.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tab);
        });

        this._currentTab = tab;
    }
};

window.SettingsDialog = SettingsDialog;
 
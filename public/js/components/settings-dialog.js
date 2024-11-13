const SettingsDialog = {
    _currentTab: 'basic',

    init() {
        if (document.querySelector('.settings-dialog')) {
            return;
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'settings-dialog';
        dialog.innerHTML = this.render();
        
        document.body.appendChild(dialog);
        this._bindEvents();
        
        // Listen for text updates
        window.addEventListener('textsUpdated', this._updateTexts.bind(this));
    },

    _updateTexts() {
        const dialog = document.querySelector('.settings-dialog');
        if (dialog) {
            dialog.innerHTML = this.render();
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

    render() {
        return `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>${i18n.t('settings.title')}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="settings-layout">
                    <div class="settings-sidebar">
                        <button class="tab-btn active" data-tab="basic">
                            ${i18n.t('settings.tabs.basic')}
                        </button>
                        <button class="tab-btn" data-tab="advanced">
                            ${i18n.t('settings.tabs.advanced')}
                        </button>
                    </div>
                    <div class="settings-main">
                        <div class="tab-content active" data-tab="basic">
                            <div class="form-group">
                                <label for="nickname">${i18n.t('settings.basic.nickname')}</label>
                                <input type="text" id="nickname" value="${localStorage.getItem('nickname') || ''}">
                            </div>
                            <div class="form-group">
                                <label for="email">${i18n.t('settings.basic.email')}</label>
                                <input type="email" id="email" value="${localStorage.getItem('email') || ''}">
                            </div>
                            <div class="form-group">
                                <label for="phone">${i18n.t('settings.basic.phone')}</label>
                                <input type="tel" id="phone" value="${localStorage.getItem('phone') || ''}">
                            </div>
                        </div>
                        <div class="tab-content" data-tab="advanced">
                            <div class="form-group">
                                <label for="notifications">${i18n.t('settings.advanced.notifications')}</label>
                                <select id="notifications">
                                    <option value="all">${i18n.t('settings.advanced.notifications.all')}</option>
                                    <option value="important">${i18n.t('settings.advanced.notifications.important')}</option>
                                    <option value="none">${i18n.t('settings.advanced.notifications.none')}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>${i18n.t('settings.advanced.security')}</label>
                                <button class="change-password-btn">
                                    ${i18n.t('settings.advanced.security.changePassword')}
                                </button>
                                <button class="logout-btn">
                                    ${i18n.t('settings.advanced.security.logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings-footer">
                    <button class="save-btn">${i18n.t('settings.save')}</button>
                    <button class="cancel-btn">${i18n.t('settings.cancel')}</button>
                </div>
            </div>
        `;
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
 
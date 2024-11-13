const SettingsDialog = {
    init() {
        // Check if dialog already exists
        if (document.querySelector('.settings-dialog')) {
            return;
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'settings-dialog';
        dialog.innerHTML = this.render();
        
        document.body.appendChild(dialog);
        this._bindEvents();
    },

    render() {
        return `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>${i18n.t('settings.title')}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="settings-body">
                    <div class="form-group">
                        <label for="nickname">${i18n.t('settings.nickname')}</label>
                        <input type="text" id="nickname" value="${localStorage.getItem('nickname') || ''}">
                    </div>
                    <div class="form-group">
                        <label for="email">${i18n.t('settings.email')}</label>
                        <input type="email" id="email" value="${localStorage.getItem('email') || ''}">
                    </div>
                    <div class="form-group">
                        <label for="phone">${i18n.t('settings.phone')}</label>
                        <input type="tel" id="phone" value="${localStorage.getItem('phone') || ''}">
                    </div>
                </div>
                <div class="settings-footer">
                    <button class="save-btn">${i18n.t('settings.save')}</button>
                    <button class="cancel-btn">${i18n.t('settings.cancel')}</button>
                    <button class="logout-btn">${i18n.t('nav.logout')}</button>
                </div>
            </div>
        `;
    },

    show() {
        const dialog = document.querySelector('.settings-dialog');
        dialog?.classList.add('show');
    },

    hide() {
        const dialog = document.querySelector('.settings-dialog');
        dialog?.classList.remove('show');
    },

    _bindEvents() {
        const dialog = document.querySelector('.settings-dialog');
        
        // Close button
        dialog?.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });

        // Cancel button
        dialog?.querySelector('.cancel-btn').addEventListener('click', () => {
            this.hide();
        });

        // Save button
        dialog?.querySelector('.save-btn').addEventListener('click', () => {
            const nickname = document.getElementById('nickname')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;

            localStorage.setItem('nickname', nickname || '');
            localStorage.setItem('email', email || '');
            localStorage.setItem('phone', phone || '');

            this.hide();
        });

        // Close when clicking outside
        dialog?.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hide();
            }
        });
    }
};

window.SettingsDialog = SettingsDialog; 
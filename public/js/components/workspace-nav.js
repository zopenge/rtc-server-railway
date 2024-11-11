window.WorkspaceNavigation = {
    render() {
        return `
            <nav class="workspace-nav">
                <div class="nav-group">
                    <div class="nav-item" data-view="tasks">
                        ${i18n.t('workspace.nav.tasks')}
                    </div>
                    <div class="nav-item" data-view="games">
                        ${i18n.t('workspace.nav.games')}
                    </div>
                    <div class="nav-item" data-view="resumeList">
                        ${i18n.t('resume.title')}
                    </div>
                </div>
                <div class="user-controls">
                    <button id="settingsBtn">
                        ${i18n.t('workspace.actions.settings')}
                    </button>
                </div>
            </nav>
        `;
    },

    init() {
        document.getElementById('workspaceNav').innerHTML = this.render();
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const viewId = e.currentTarget.getAttribute('data-view');
                if (viewId) {
                    Workspace.switchView(viewId);
                }
            });
        });

        // Add settings button handler
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            SettingsDialog.show();
        });
    }
}; 
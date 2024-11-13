class WorkspaceNavigation extends UserNavigation {
    constructor() {
        super({
            className: 'workspace-nav',
            leftContent: `
                <div class="workspace-content">
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
                    <div class="workspace-footer">
                        <button id="settingsBtn" class="settings-btn">
                            ${i18n.t('workspace.actions.settings')}
                        </button>
                    </div>
                </div>
            `
        });

        this._bindNavEvents();
    }

    _bindCustomEvents() {
        super._bindCustomEvents();
        this._bindSettingsEvent();
    }

    _bindSettingsEvent() {
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            SettingsDialog.show();
        });
    }

    _bindNavEvents() {
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                const viewId = navItem.getAttribute('data-view');
                if (viewId) {
                    Workspace.switchView(viewId);
                }
            }
        });
    }
}

// Export the class instead of an instance
window.WorkspaceNavigation = WorkspaceNavigation;
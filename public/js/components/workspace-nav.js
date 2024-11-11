class WorkspaceNavigation extends UserNavigation {
    constructor() {
        super({
            className: 'workspace-nav',
            leftContent: `<h1>${i18n.t('workspace.title')}</h1>`
        });
    }
}

// Export the class instead of an instance
window.WorkspaceNavigation = WorkspaceNavigation; 
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for translations to load
    const currentLang = i18n.getCurrentLanguage();
    await loadTranslations(currentLang);

    // Only initialize workspace on workspace page
    if (window.location.pathname === '/workspace') {
        // Register modules
        Workspace.registerView('games', GamesModule);
        Workspace.registerView('gameContent', GameContentModule);
        Workspace.registerView('modelEditor', ModelEditorModule);
        Workspace.registerView('sceneEditor', SceneEditorModule);
        Workspace.registerView('particleEditor', ParticleEditorModule);
        Workspace.registerView('resumeList', ResumeListModule);
        Workspace.registerView('resumeEditor', ResumeEditorModule);
        Workspace.registerView('tasks', TasksModule);

        // Initialize workspace
        Workspace.init();
    } else {
        // Initialize App for non-workspace pages
        App.init();
    }
}); 
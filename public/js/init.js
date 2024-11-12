document.addEventListener('DOMContentLoaded', () => {
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
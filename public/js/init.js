document.addEventListener('DOMContentLoaded', () => {
    // Register modules
    Workspace.registerView('games', GamesModule);
    Workspace.registerView('gameContent', GameContentModule);

    // Register editors
    Workspace.registerView('modelEditor', ModelEditorModule);
    Workspace.registerView('sceneEditor', SceneEditorModule);
    Workspace.registerView('particleEditor', ParticleEditorModule);

    // Register resume modules
    Workspace.registerView('resumeList', ResumeListModule);
    Workspace.registerView('resumeEditor', ResumeEditorModule);

    // Register tasks module
    Workspace.registerView('tasks', TasksModule);

    // Initialize workspace
    Workspace.init();
}); 
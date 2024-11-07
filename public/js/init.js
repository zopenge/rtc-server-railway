// Initialize workspace and register modules
document.addEventListener('DOMContentLoaded', () => {
    // Register modules
    Workspace.registerView('games', GamesModule);
    Workspace.registerView('gameContent', GameContentModule);
    
    // Register games
    GamesModule.registerGame({
        id: 'duel-cards',
        name: i18n.games.duelCards.name,
        description: i18n.games.duelCards.description,
        icon: gameIconManager.getIcon('game-cards')
    });

    // Initialize workspace
    Workspace.init();
}); 
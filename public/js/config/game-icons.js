class GameIconManager {
    constructor() {
        this.icons = {
            'game-cards': {
                emoji: '🃏',  // fallback emoji
                path: '/assets/icons/cards.svg'  // path to the actual icon file
            }
            // Add more game icons here
        };
    }

    // get icon path or emoji for given game type
    getIcon(iconId) {
        const icon = this.icons[iconId];
        return icon?.path || icon?.emoji || '🎮';
    }

    // add new game icon
    addIcon(iconId, path, emoji) {
        this.icons[iconId] = { path, emoji };
    }
}

// create singleton instance and expose to window
window.gameIconManager = new GameIconManager(); 
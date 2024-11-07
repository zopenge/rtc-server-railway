// Games module
const GamesModule = (function() {
    // private state and methods
    const _games = new Map();

    function _renderGamesList(container) {
        const gameCards = Array.from(_games.values()).map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-icon">${game.icon}</div>
                <h3 class="game-title">${game.name}</h3>
                <p class="game-description">${game.description}</p>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="game-grid">
                ${gameCards}
            </div>
        `;

        // Add click handlers
        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-game-id');
                Workspace.switchView('gameContent', { gameId });
            });
        });
    }

    // public API
    return {
        // register a new game
        registerGame(gameConfig) {
            _games.set(gameConfig.id, gameConfig);
        },

        // render method required by workspace
        render(params = {}) {
            const container = document.getElementById('contentGrid');
            _renderGamesList(container);
        },

        // cleanup method (optional)
        cleanup() {
            // cleanup any resources if needed
        }
    };
})(); 
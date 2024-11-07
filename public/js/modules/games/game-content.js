// Game content module
window.GameContentModule = {
    // render method required by workspace
    render({ gameId }) {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <button class="action-button" id="backToGames">
                        ${i18n.common.back}
                    </button>
                </div>
                <div class="game-content">
                    <iframe 
                        src="/games/${gameId}" 
                        frameborder="0" 
                        class="game-frame">
                    </iframe>
                </div>
            </div>
        `;

        document.getElementById('backToGames').addEventListener('click', () => {
            Workspace.switchView('games');
        });
    },

    // cleanup method (optional)
    cleanup() {
        // cleanup iframe content if needed
    }
}; 
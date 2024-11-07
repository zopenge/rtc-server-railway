(function () {
    let currentTasks = [];
    let processingTask = null;

    async function loadWorkspace() {
        try {
            const response = await fetch('/api/user/info');
            if (!response.ok) {
                window.location.href = '/login';
                return;
            }
            const userData = await response.json();
            updateUI(userData);
        } catch (error) {
            console.error('Failed to load workspace:', error);
        }
    }

    function updateUI(userData) {
        document.getElementById('sidebarTitle').textContent = i18n.t('workspace.sidebar.title');
        document.getElementById('tasksText').textContent = i18n.t('workspace.nav.tasks');
        document.getElementById('historyText').textContent = i18n.t('workspace.nav.history');
        document.getElementById('gamesText').textContent = i18n.t('workspace.nav.games');
        document.getElementById('refreshButton').textContent = i18n.t('workspace.actions.refresh');
        document.getElementById('settingsButton').textContent = i18n.t('workspace.actions.settings');
        
        // Add click handler for games nav
        document.getElementById('gamesNav').addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            document.getElementById('gamesNav').classList.add('active');
            loadGamesView();
        });
    }

    function loadGamesView() {
        const contentGrid = document.getElementById('contentGrid');
        contentGrid.innerHTML = `
            <div class="game-grid">
                <div class="game-card" onclick="loadGame('duelCards')">
                    <div class="game-icon">${getGameIcon(i18n.games.duelCards.iconId)}</div>
                    <h3 class="game-title">${i18n.games.duelCards.name}</h3>
                    <p class="game-description">${i18n.games.duelCards.description}</p>
                </div>
            </div>
        `;
    }

    function loadGame(gameType) {
        if (gameType === 'duelCards') {
            window.location.href = '/games/duel-cards';
        }
    }

    // Register workspace page lifecycle
    PageLifecycle.register('workspace', {
        mount: () => {
            window.addEventListener('textsUpdated', loadWorkspace);
            loadWorkspace();
        },
        unmount: () => {
            window.removeEventListener('textsUpdated', loadWorkspace);
        }
    });
})(); 
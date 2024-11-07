const gameIcons = {
    'game-cards': {
        emoji: '🃏',  // fallback emoji
        path: '/assets/icons/cards.svg'  // path to the actual icon file
    }
    // Add more game icons here
};

// Helper function to get game icon
function getGameIcon(iconId) {
    const icon = gameIcons[iconId];
    // Return SVG path if available, otherwise fallback to emoji
    return icon?.path || icon?.emoji || '🎮';
} 
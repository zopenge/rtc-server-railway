window.ParticleEditorModule = {
    _state: {
        currentEffect: null,
        isPlaying: false,
        parameters: new Map()
    },

    render(params = {}) {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="editor-container">
                <div class="toolbar" id="particleToolbar"></div>
                <div class="main-content">
                    <div class="preview-area" id="particlePreview"></div>
                    <div class="property-panel" id="particleProperties"></div>
                </div>
            </div>
        `;

        this._initComponents();
        this._setupTools();
        this._bindEvents();
    },

    _initComponents() {
        PreviewPanel.init('particlePreview');
        Toolbar.init('particleToolbar');
        PropertyPanel.init('particleProperties');
    },

    _setupTools() {
        Toolbar.addTool('play', {
            icon: '▶️',
            label: 'Play',
            action: () => this._togglePlay()
        });

        Toolbar.addTool('save', {
            icon: '💾',
            label: 'Save Effect',
            action: () => this._saveEffect()
        });
    },

    _bindEvents() {
        window.addEventListener('resize', () => {
            PreviewPanel.resize();
        });
    },

    cleanup() {
        PreviewPanel.cleanup();
        Toolbar.cleanup();
        PropertyPanel.cleanup();
    },

    // Editor specific methods
    _togglePlay() {
        this._state.isPlaying = !this._state.isPlaying;
        console.log('Toggle particle effect:', this._state.isPlaying);
    },

    _saveEffect() {
        console.log('Save particle effect');
    }
}; 
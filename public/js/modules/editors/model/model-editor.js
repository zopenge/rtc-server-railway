window.ModelEditorModule = {
    _state: {
        currentModel: null,
        selectedParts: new Set(),
        viewMode: '3d'
    },

    render(params = {}) {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="editor-container">
                <div class="toolbar" id="modelToolbar"></div>
                <div class="main-content">
                    <div class="preview-area" id="modelPreview"></div>
                    <div class="property-panel" id="modelProperties"></div>
                </div>
            </div>
        `;

        this._initComponents();
        this._setupTools();
        this._bindEvents();
    },

    _initComponents() {
        // Initialize preview panel
        PreviewPanel.init('modelPreview');
        
        // Initialize toolbar
        Toolbar.init('modelToolbar');
        
        // Initialize property panel
        PropertyPanel.init('modelProperties');
    },

    _setupTools() {
        Toolbar.addTool('import', {
            icon: '📥',
            label: 'Import',
            action: () => this._importModel()
        });

        Toolbar.addTool('export', {
            icon: '📤',
            label: 'Export',
            action: () => this._exportModel()
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
    _importModel() {
        console.log('Import model');
    },

    _exportModel() {
        console.log('Export model');
    }
}; 
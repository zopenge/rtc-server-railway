window.EditorToolbar = {
    // Common editor tools configuration
    _commonTools: {
        undo: {
            icon: '↩️',
            label: 'Undo',
            action: (editor) => editor._undo(),
            shortcut: 'Ctrl+Z'
        },
        redo: {
            icon: '↪️',
            label: 'Redo',
            action: (editor) => editor._redo(),
            shortcut: 'Ctrl+Y'
        },
        save: {
            icon: '💾',
            label: 'Save',
            action: (editor) => editor._save(),
            shortcut: 'Ctrl+S'
        }
    },

    /**
     * Initialize toolbar for an editor
     * @param {string} containerId - Toolbar container element ID
     * @param {Object} editor - Editor instance
     * @param {Array} tools - Array of tool IDs to include
     */
    init(containerId, editor, tools = []) {
        // Initialize base toolbar
        Toolbar.init(containerId);
        
        // Add common tools
        tools.forEach(toolId => {
            if (this._commonTools[toolId]) {
                const tool = this._commonTools[toolId];
                Toolbar.addTool(toolId, {
                    ...tool,
                    action: () => tool.action(editor)
                });
            }
        });

        // Setup keyboard shortcuts
        this._setupShortcuts(editor, tools);
    },

    /**
     * Setup keyboard shortcuts for toolbar actions
     * @private
     */
    _setupShortcuts(editor, tools) {
        tools.forEach(toolId => {
            const tool = this._commonTools[toolId];
            if (tool.shortcut) {
                // Convert shortcut string to event key (e.g., 'Ctrl+Z' to 'z')
                const key = tool.shortcut.split('+').pop().toLowerCase();
                
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key.toLowerCase() === key) {
                        e.preventDefault();
                        tool.action(editor);
                    }
                });
            }
        });
    },

    /**
     * Update tool state
     * @param {string} toolId - Tool identifier
     * @param {Object} state - New tool state
     */
    updateTool(toolId, state) {
        Toolbar.updateTool(toolId, state);
    }
}; 
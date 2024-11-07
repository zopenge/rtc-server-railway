window.Toolbar = {
    _container: null,
    _tools: new Map(),

    init(containerId) {
        this._container = document.getElementById(containerId);
        if (!this._container) {
            console.error('Toolbar container not found:', containerId);
            return;
        }
    },

    addTool(id, config) {
        const { icon, label, action } = config;
        
        const button = document.createElement('button');
        button.className = 'tool-button';
        button.innerHTML = `
            <span class="tool-icon">${icon}</span>
            <span class="tool-label">${label}</span>
        `;
        button.addEventListener('click', action);
        
        this._tools.set(id, button);
        this._container.appendChild(button);
    },

    removeTool(id) {
        const tool = this._tools.get(id);
        if (tool) {
            tool.remove();
            this._tools.delete(id);
        }
    },

    cleanup() {
        this._tools.clear();
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}; 
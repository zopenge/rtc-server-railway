window.PropertyPanel = {
    _container: null,
    _properties: new Map(),

    init(containerId) {
        this._container = document.getElementById(containerId);
        if (!this._container) {
            console.error('Property panel container not found:', containerId);
            return;
        }
    },

    setProperties(properties) {
        this._container.innerHTML = '';
        this._properties.clear();

        for (const [key, config] of Object.entries(properties)) {
            this._addProperty(key, config);
        }
    },

    _addProperty(key, config) {
        const { label, type, value, onChange } = config;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'property-field';
        wrapper.innerHTML = `
            <label>${label}</label>
            <input type="${type}" value="${value}">
        `;

        const input = wrapper.querySelector('input');
        input.addEventListener('change', (e) => onChange(e.target.value));
        
        this._properties.set(key, wrapper);
        this._container.appendChild(wrapper);
    },

    cleanup() {
        this._properties.clear();
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}; 
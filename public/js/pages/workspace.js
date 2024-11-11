// Core workspace management
const Workspace = (function() {
    // private state
    const _views = new Map();
    let _currentView = null;

    // private methods
    function _updateNavigation(viewId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            }
        });
    }

    // public API
    return {
        // register a new view module
        registerView(viewId, viewModule) {
            if (_views.has(viewId)) {
                console.warn(`View ${viewId} is already registered`);
                return;
            }
            _views.set(viewId, viewModule);
        },

        // switch to a specific view
        switchView(viewId, params = {}) {
            const view = _views.get(viewId);
            if (!view) {
                console.error(`View ${viewId} not found`);
                return;
            }

            // cleanup current view if exists
            if (_currentView && _views.get(_currentView).cleanup) {
                _views.get(_currentView).cleanup();
            }

            // update navigation state
            _updateNavigation(viewId);

            // render new view
            _currentView = viewId;
            view.render(params);
        },

        // initialize workspace
        init() {
            // switch to default view
            this.switchView('tasks');
        }
    };
})();

// Export to global scope
window.Workspace = Workspace; 
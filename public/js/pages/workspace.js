// Core workspace management
const Workspace = (function() {
    // private state
    const _views = new Map();
    let _currentView = null;

    // private methods
    function _initializeUI() {
        // basic UI initialization
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const viewId = e.currentTarget.getAttribute('data-view');
                if (viewId) {
                    switchView(viewId);
                }
            });
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
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            const navItem = document.getElementById(`${viewId}Nav`);
            if (navItem) navItem.classList.add('active');

            // render new view
            _currentView = viewId;
            view.render(params);
        },

        // initialize workspace
        init() {
            _initializeUI();
            // switch to default view
            this.switchView('tasks');
        }
    };
})();

// Export to global scope
window.Workspace = Workspace; 
// Page lifecycle management
const PageLifecycle = {
    currentPage: null,
    handlers: {},

    // Register page handlers
    register(pageName, { mount, unmount } = {}) {
        this.handlers[pageName] = {
            mount: mount || (() => {}),
            unmount: unmount || (() => {})
        };
    },

    // Mount a page
    mount(pageName) {
        if (this.currentPage) {
            this.unmount(this.currentPage);
        }
        
        this.currentPage = pageName;
        if (this.handlers[pageName]) {
            this.handlers[pageName].mount();
        }
    },

    // Unmount current page
    unmount(pageName) {
        if (this.handlers[pageName]) {
            this.handlers[pageName].unmount();
        }
    }
};

window.PageLifecycle = PageLifecycle; 
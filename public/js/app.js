const App = (function () {
    let content;

    async function loadPage(page) {
        // Unmount current page if exists
        if (PageLifecycle.currentPage) {
            PageLifecycle.unmount(PageLifecycle.currentPage);
            // Remove old page script if exists
            const oldScript = document.querySelector(`script[src="/js/pages/${PageLifecycle.currentPage}.js"]`);
            if (oldScript) {
                oldScript.remove();
            }
        }

        try {
            const response = await fetch(`/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            content.innerHTML = html;

            // Add this section to load page-specific scripts
            const script = document.createElement('script');
            script.src = `/js/pages/${page}.js`;
            script.onload = () => {
                PageLifecycle.mount(page);
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error('Failed to load page:', error);
            content.innerHTML = '<p>Failed to load content. Please try again later.</p>';
        }
    }

    return {
        init() {
            // Only handle non-workspace pages
            if (window.location.pathname === '/workspace') {
                return;
            }

            content = document.getElementById('content');
            if (!content) {
                console.error('Failed to initialize: content element not found');
                return;
            }

            // Check authentication status
            fetch('/auth/status')
                .then(response => response.json())
                .then(data => {
                    if (data.authenticated) {
                        window.location.href = '/workspace';
                    } else {
                        const authNav = new AuthNavigation();
                        authNav.init();
                        loadPage('welcome');
                    }
                })
                .catch(error => {
                    console.error('Auth check failed:', error);
                    const authNav = new AuthNavigation();
                    authNav.init();
                    loadPage('welcome');
                });
        },

        async showLogin() {
            await loadPage('login');
            window.location.hash = 'login';
        },

        async showRegister() {
            await loadPage('login');
            window.location.hash = 'register';
        }
    };
})();

// Add beforeunload handler
function handleBeforeUnload(e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
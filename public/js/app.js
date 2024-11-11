const App = (function () {
    let content;

    async function loadPage(page) {
        try {
            const response = await fetch(`/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            content.innerHTML = html;

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
            content = document.getElementById('content');
            if (!content) {
                console.error('Failed to initialize: content element not found');
                return;
            }

            // Check authentication status from server instead of localStorage
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

        showLogin() {
            loadPage('login').catch(() => {
                history.pushState(null, '', '/');
                loadPage('welcome');
            });
            history.pushState(null, '', '/user/login');
        },

        showRegister() {
            loadPage('login').catch(() => {
                history.pushState(null, '', '/');
                loadPage('welcome');
            });
            history.pushState(null, '', '/user/register');
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